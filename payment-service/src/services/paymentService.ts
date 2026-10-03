import { config } from "../config.js";
import { pool, withTransaction } from "../db/pool.js";
import { getGateway } from "../gateways/index.js";
import { ConflictError, NotFoundError, ValidationError } from "../lib/errors.js";
import { newTxRef, newUuid } from "../lib/ids.js";
import {
  assertTransition,
  canTransition,
  type TransactionStatus,
} from "../domain/stateMachine.js";
import {
  buildCaptureLines,
  buildRefundLines,
  entitlementRevenueAccount,
  postJournal,
} from "./ledgerService.js";

export interface InitiatePaymentInput {
  userId: string;
  planCode: string;
  gateway?: string;
  idempotencyKey?: string;
  /** For 'employer_starter_post': the job draft being purchased. */
  jobDraft?: { title: string; payload?: Record<string, unknown> };
  /** For subscription invoices created internally. */
  invoiceId?: string;
  orderId?: string;
  customer?: { email?: string; firstName?: string; lastName?: string; phone?: string };
}

export interface InitiatePaymentResult {
  txRef: string;
  checkoutUrl: string;
  transactionId: string;
  orderId: string;
  amountSantim: number;
  currency: string;
  gateway: string;
  reused: boolean;
}

/**
 * Create order + transaction, then hand off to the gateway for a checkout URL.
 * Fully idempotent: the same (userId, idempotencyKey) always returns the same
 * transaction and never re-charges.
 */
export async function initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
  // 1. Idempotency short-circuit.
  if (input.idempotencyKey) {
    const { rows } = await pool.query(
      `SELECT t.id, t.tx_ref, t.checkout_url, t.order_id, t.amount_santim, t.currency, t.gateway, t.status
       FROM transactions t WHERE t.user_id = $1 AND t.idempotency_key = $2`,
      [input.userId, input.idempotencyKey],
    );
    const existing = rows[0];
    if (existing) {
      if (!existing.checkout_url) throw new ConflictError("A previous identical request is still being processed");
      return {
        txRef: existing.tx_ref,
        checkoutUrl: existing.checkout_url,
        transactionId: existing.id,
        orderId: existing.order_id,
        amountSantim: Number(existing.amount_santim),
        currency: existing.currency,
        gateway: existing.gateway,
        reused: true,
      };
    }
  }

  const gateway = getGateway(input.gateway);

  // 2. Resolve plan + create order/draft/transaction atomically.
  const created = await withTransaction(async (client) => {
    const planRes = await client.query(
      "SELECT code, name, kind, amount_santim, currency, entitlement FROM plans WHERE code = $1 AND active",
      [input.planCode],
    );
    const plan = planRes.rows[0];
    if (!plan) throw new ValidationError(`Unknown or inactive plan: ${input.planCode}`);

    let orderId = input.orderId ?? null;
    let referenceId: string | null = input.invoiceId ?? null;

    // Job-post purchases persist the draft NOW so payment references a real thing.
    if (plan.entitlement === "job_post_publish") {
      if (!input.jobDraft?.title) throw new ValidationError("jobDraft.title is required for job post purchases");
      referenceId = newUuid();
      await client.query(
        "INSERT INTO job_posts (id, user_id, title, payload, status) VALUES ($1, $2, $3, $4, 'draft')",
        [referenceId, input.userId, input.jobDraft.title, JSON.stringify(input.jobDraft.payload ?? {})],
      );
    }

    if (!orderId) {
      orderId = newUuid();
      await client.query(
        `INSERT INTO orders (id, user_id, plan_code, kind, reference_id, amount_santim, currency, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          orderId,
          input.userId,
          plan.code,
          plan.kind === "subscription" ? "subscription_invoice" : "one_time",
          referenceId,
          plan.amount_santim,
          plan.currency,
          JSON.stringify({ planName: plan.name }),
        ],
      );
    }

    const transactionId = newUuid();
    const txRef = newTxRef();
    const expiresAt = new Date(Date.now() + config.PAYMENT_EXPIRY_MINUTES * 60_000);
    await client.query(
      `INSERT INTO transactions (id, order_id, user_id, tx_ref, gateway, status, amount_santim, currency, idempotency_key, expires_at)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $7, $8, $9)`,
      [transactionId, orderId, input.userId, txRef, gateway.name, plan.amount_santim, plan.currency, input.idempotencyKey ?? null, expiresAt],
    );
    await client.query(
      `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
       VALUES ($1, NULL, 'PENDING', 'system', $2)`,
      [transactionId, JSON.stringify({ plan: plan.code })],
    );

    return {
      transactionId,
      txRef,
      orderId: orderId as string,
      amountSantim: Number(plan.amount_santim),
      currency: plan.currency as string,
      planName: plan.name as string,
    };
  });

  // 3. Ask the gateway for a checkout URL (outside the DB transaction —
  //    network calls never belong inside one).
  try {
    const init = await gateway.initiate({
      txRef: created.txRef,
      amountSantim: created.amountSantim,
      currency: created.currency,
      customer: input.customer ?? {},
      title: "Konyx",
      callbackUrl: `${config.PUBLIC_BASE_URL}/v1/webhooks/${gateway.name}`,
      returnUrl: `${config.FRONTEND_RETURN_URL}?tx_ref=${encodeURIComponent(created.txRef)}`,
    });

    await pool.query(
      `UPDATE transactions
       SET status = 'PROCESSING', checkout_url = $2, gateway_tx_id = COALESCE($3, gateway_tx_id),
           gateway_response = $4, updated_at = now()
       WHERE id = $1`,
      [created.transactionId, init.checkoutUrl, init.gatewayTxId ?? null, JSON.stringify(init.raw ?? {})],
    );
    await pool.query(
      `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
       VALUES ($1, 'PENDING', 'PROCESSING', 'system', '{}')`,
      [created.transactionId],
    );

    return {
      txRef: created.txRef,
      checkoutUrl: init.checkoutUrl,
      transactionId: created.transactionId,
      orderId: created.orderId,
      amountSantim: created.amountSantim,
      currency: created.currency,
      gateway: gateway.name,
      reused: false,
    };
  } catch (err) {
    // Gateway initiation failed: mark the attempt failed so idempotent retries
    // are not blocked forever.
    await markFailed(created.transactionId, `gateway initiation error: ${(err as Error).message}`, "system");
    throw err;
  }
}

async function markFailed(transactionId: string, reason: string, source: string): Promise<void> {
  await withTransaction(async (client) => {
    const { rows } = await client.query("SELECT status FROM transactions WHERE id = $1 FOR UPDATE", [transactionId]);
    const current = rows[0]?.status as TransactionStatus | undefined;
    if (!current || !canTransition(current, "FAILED")) return;
    await client.query(
      "UPDATE transactions SET status = 'FAILED', failure_reason = $2, idempotency_key = NULL, updated_at = now() WHERE id = $1",
      [transactionId, reason],
    );
    await client.query(
      `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
       VALUES ($1, $2, 'FAILED', $3, $4)`,
      [transactionId, current, source, JSON.stringify({ reason })],
    );
  });
}

export interface SettlementOutcome {
  txRef: string;
  previousStatus: TransactionStatus;
  status: TransactionStatus;
  changed: boolean;
}

/**
 * THE settlement pipeline. Called from webhooks, client polling, admin, and
 * reconciliation — every path converges here, and the gateway verify API is
 * always the source of truth. Safe to call any number of times (idempotent).
 */
export async function settleByVerification(txRef: string, source: string): Promise<SettlementOutcome> {
  const txRow = await pool.query("SELECT id, gateway, status FROM transactions WHERE tx_ref = $1", [txRef]);
  const tx = txRow.rows[0];
  if (!tx) throw new NotFoundError(`Unknown tx_ref: ${txRef}`);

  const gateway = getGateway(tx.gateway);
  const verification = await gateway.verify(txRef);

  return withTransaction(async (client) => {
    // Lock the row; re-read status under the lock.
    const locked = await client.query(
      `SELECT t.*, o.plan_code, o.reference_id, o.user_id AS order_user_id, p.entitlement, p.kind AS plan_kind, p.interval
       FROM transactions t
       JOIN orders o ON o.id = t.order_id
       JOIN plans p ON p.code = o.plan_code
       WHERE t.tx_ref = $1 FOR UPDATE OF t`,
      [txRef],
    );
    const row = locked.rows[0];
    const current = row.status as TransactionStatus;

    const record = async (to: TransactionStatus, detail: Record<string, unknown>) => {
      await client.query(
        `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
         VALUES ($1, $2, $3, $4, $5)`,
        [row.id, current, to, source, JSON.stringify(detail)],
      );
    };

    if (verification.status === "success") {
      if (!canTransition(current, "PAID")) {
        // Already PAID (or refunded) — idempotent no-op.
        return { txRef, previousStatus: current, status: current, changed: false };
      }

      // Amount integrity check: what the gateway says was paid must match the order.
      const paidAmount = verification.amountSantim ?? Number(row.amount_santim);
      const paidCurrency = verification.currency ?? row.currency;
      if (paidAmount !== Number(row.amount_santim) || paidCurrency !== row.currency) {
        assertTransition(current, "FAILED");
        await client.query(
          `UPDATE transactions SET status = 'FAILED', failure_reason = $2, gateway_response = $3, updated_at = now() WHERE id = $1`,
          [
            row.id,
            `amount mismatch: expected ${row.amount_santim} ${row.currency}, gateway reports ${paidAmount} ${paidCurrency}`,
            JSON.stringify(verification.raw ?? {}),
          ],
        );
        await record("FAILED", { reason: "amount_mismatch", expected: Number(row.amount_santim), got: paidAmount });
        return { txRef, previousStatus: current, status: "FAILED" as const, changed: true };
      }

      assertTransition(current, "PAID");
      await client.query(
        `UPDATE transactions
         SET status = 'PAID', paid_at = now(), gateway_tx_id = COALESCE($2, gateway_tx_id),
             gateway_response = $3, updated_at = now()
         WHERE id = $1`,
        [row.id, verification.gatewayTxId ?? null, JSON.stringify(verification.raw ?? {})],
      );
      await client.query("UPDATE orders SET status = 'paid', updated_at = now() WHERE id = $1", [row.order_id]);
      await record("PAID", { verifiedBy: source, gatewayTxId: verification.gatewayTxId });

      // Double-entry ledger.
      await postJournal(client, {
        transactionId: row.id,
        kind: "payment_captured",
        memo: `Payment captured for ${row.plan_code} (${txRef})`,
        lines: buildCaptureLines(
          Number(row.amount_santim),
          entitlementRevenueAccount(row.entitlement),
          verification.feeSantim ?? 0,
        ),
      });

      // Outbox: fulfillment happens asynchronously but is committed atomically
      // with the money. A crash can never take money without delivering.
      await client.query(
        "INSERT INTO outbox_events (type, payload) VALUES ('entitlement.grant', $1)",
        [
          JSON.stringify({
            transactionId: row.id,
            orderId: row.order_id,
            userId: row.user_id,
            planCode: row.plan_code,
            planKind: row.plan_kind,
            interval: row.interval,
            entitlement: row.entitlement,
            referenceId: row.reference_id,
          }),
        ],
      );

      return { txRef, previousStatus: current, status: "PAID" as const, changed: true };
    }

    if (verification.status === "failed") {
      if (!canTransition(current, "FAILED")) {
        return { txRef, previousStatus: current, status: current, changed: false };
      }
      await client.query(
        `UPDATE transactions SET status = 'FAILED', failure_reason = 'gateway reported failure',
         gateway_response = $2, idempotency_key = NULL, updated_at = now() WHERE id = $1`,
        [row.id, JSON.stringify(verification.raw ?? {})],
      );
      await record("FAILED", { reason: "gateway_failed" });
      return { txRef, previousStatus: current, status: "FAILED" as const, changed: true };
    }

    // pending / not_found: no state change; reconciliation will sweep expiry.
    return { txRef, previousStatus: current, status: current, changed: false };
  });
}

/** Expire stale PENDING/PROCESSING transactions past their expiry window. */
export async function expireStaleTransaction(txRef: string): Promise<boolean> {
  return withTransaction(async (client) => {
    const { rows } = await client.query("SELECT id, status, expires_at FROM transactions WHERE tx_ref = $1 FOR UPDATE", [txRef]);
    const row = rows[0];
    if (!row) return false;
    const current = row.status as TransactionStatus;
    if (!canTransition(current, "EXPIRED")) return false;
    if (!row.expires_at || new Date(row.expires_at) > new Date()) return false;
    await client.query(
      "UPDATE transactions SET status = 'EXPIRED', idempotency_key = NULL, updated_at = now() WHERE id = $1",
      [row.id],
    );
    await client.query(
      `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
       VALUES ($1, $2, 'EXPIRED', 'reconciliation', '{}')`,
      [row.id, current],
    );
    return true;
  });
}

/** Admin-initiated refund: ask the gateway, then move to REFUND_PENDING. */
export async function requestRefund(txRef: string, reason: string): Promise<SettlementOutcome> {
  const txRow = await pool.query("SELECT id, gateway, status FROM transactions WHERE tx_ref = $1", [txRef]);
  const tx = txRow.rows[0];
  if (!tx) throw new NotFoundError(`Unknown tx_ref: ${txRef}`);
  assertTransition(tx.status, "REFUND_PENDING");

  const gateway = getGateway(tx.gateway);
  const result = await gateway.refund(txRef, reason);
  if (!result.accepted) throw new ConflictError("Gateway rejected the refund request");

  return withTransaction(async (client) => {
    const { rows } = await client.query("SELECT id, status FROM transactions WHERE tx_ref = $1 FOR UPDATE", [txRef]);
    const row = rows[0];
    const current = row.status as TransactionStatus;
    assertTransition(current, "REFUND_PENDING");
    await client.query("UPDATE transactions SET status = 'REFUND_PENDING', updated_at = now() WHERE id = $1", [row.id]);
    await client.query(
      `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
       VALUES ($1, $2, 'REFUND_PENDING', 'admin', $3)`,
      [row.id, current, JSON.stringify({ reason })],
    );
    return { txRef, previousStatus: current, status: "REFUND_PENDING" as const, changed: true };
  });
}

/** Confirm a refund (reconciliation or admin after checking the gateway). */
export async function confirmRefund(txRef: string, source: string): Promise<SettlementOutcome> {
  return withTransaction(async (client) => {
    const { rows } = await client.query(
      `SELECT t.id, t.status, t.amount_santim, t.user_id, o.plan_code, o.reference_id, p.entitlement
       FROM transactions t JOIN orders o ON o.id = t.order_id JOIN plans p ON p.code = o.plan_code
       WHERE t.tx_ref = $1 FOR UPDATE OF t`,
      [txRef],
    );
    const row = rows[0];
    if (!row) throw new NotFoundError(`Unknown tx_ref: ${txRef}`);
    const current = row.status as TransactionStatus;
    assertTransition(current, "REFUNDED");

    await client.query("UPDATE transactions SET status = 'REFUNDED', updated_at = now() WHERE id = $1", [row.id]);
    await client.query(
      `INSERT INTO transaction_events (transaction_id, from_status, to_status, source, detail)
       VALUES ($1, $2, 'REFUNDED', $3, '{}')`,
      [row.id, current, source],
    );
    await postJournal(client, {
      transactionId: row.id,
      kind: "refund",
      memo: `Refund for ${txRef}`,
      lines: buildRefundLines(Number(row.amount_santim)),
    });
    await client.query("INSERT INTO outbox_events (type, payload) VALUES ('entitlement.revoke', $1)", [
      JSON.stringify({
        transactionId: row.id,
        userId: row.user_id,
        entitlement: row.entitlement,
        referenceId: row.reference_id,
      }),
    ]);
    return { txRef, previousStatus: current, status: "REFUNDED" as const, changed: true };
  });
}

export async function getTransactionForUser(txRef: string, userId: string) {
  const { rows } = await pool.query(
    `SELECT t.tx_ref, t.status, t.amount_santim, t.currency, t.gateway, t.checkout_url,
            t.paid_at, t.failure_reason, t.created_at, o.plan_code, o.reference_id
     FROM transactions t JOIN orders o ON o.id = t.order_id
     WHERE t.tx_ref = $1 AND t.user_id = $2`,
    [txRef, userId],
  );
  if (!rows[0]) throw new NotFoundError("Transaction not found");
  return rows[0];
}
