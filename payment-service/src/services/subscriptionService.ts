import type pg from "pg";
import { config } from "../config.js";
import { pool, withTransaction } from "../db/pool.js";
import { ConflictError, NotFoundError, ValidationError } from "../lib/errors.js";
import { newInvoiceNumber, newUuid } from "../lib/ids.js";
import { initiatePayment, type InitiatePaymentResult } from "./paymentService.js";

function addInterval(from: Date, interval: "month" | "year"): Date {
  const d = new Date(from);
  if (interval === "month") d.setUTCMonth(d.getUTCMonth() + 1);
  else d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d;
}

export interface SubscribeInput {
  userId: string;
  planCode: string;
  gateway?: string;
  idempotencyKey?: string;
  customer?: { email?: string; firstName?: string; lastName?: string; phone?: string };
}

/**
 * Start (or resume paying for) a subscription.
 * Ethiopian rails have no card-on-file recurring billing, so a subscription is
 * a chain of invoices, each paid through a normal checkout.
 */
export async function subscribe(input: SubscribeInput): Promise<{
  subscriptionId: string;
  invoiceId: string;
  payment: InitiatePaymentResult;
}> {
  const prepared = await withTransaction(async (client) => {
    const planRes = await client.query(
      "SELECT code, kind, amount_santim, currency, interval, entitlement FROM plans WHERE code = $1 AND active",
      [input.planCode],
    );
    const plan = planRes.rows[0];
    if (!plan) throw new ValidationError(`Unknown or inactive plan: ${input.planCode}`);
    if (plan.kind !== "subscription") throw new ValidationError(`${input.planCode} is not a subscription plan`);

    // One live subscription per entitlement per user.
    const existing = await client.query(
      `SELECT s.id, s.status FROM subscriptions s
       JOIN plans p ON p.code = s.plan_code
       WHERE s.user_id = $1 AND p.entitlement = $2 AND s.status IN ('active', 'past_due')`,
      [input.userId, plan.entitlement],
    );
    if (existing.rows[0]) {
      throw new ConflictError(`User already has an ${existing.rows[0].status} subscription for ${plan.entitlement}`);
    }

    // Reuse an incomplete subscription + open invoice if one exists for this plan.
    const incomplete = await client.query(
      `SELECT s.id AS sub_id, i.id AS invoice_id, i.order_id
       FROM subscriptions s
       LEFT JOIN invoices i ON i.subscription_id = s.id AND i.status = 'open'
       WHERE s.user_id = $1 AND s.plan_code = $2 AND s.status = 'incomplete'
       ORDER BY s.created_at DESC LIMIT 1`,
      [input.userId, input.planCode],
    );

    if (incomplete.rows[0]?.invoice_id) {
      return {
        subscriptionId: incomplete.rows[0].sub_id as string,
        invoiceId: incomplete.rows[0].invoice_id as string,
        orderId: incomplete.rows[0].order_id as string | null,
        plan,
      };
    }

    const subscriptionId = (incomplete.rows[0]?.sub_id as string | undefined) ?? newUuid();
    if (!incomplete.rows[0]) {
      await client.query(
        "INSERT INTO subscriptions (id, user_id, plan_code, status) VALUES ($1, $2, $3, 'incomplete')",
        [subscriptionId, input.userId, input.planCode],
      );
    }

    const now = new Date();
    const invoiceId = newUuid();
    await client.query(
      `INSERT INTO invoices (id, number, subscription_id, amount_santim, currency, period_start, period_end, due_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open')`,
      [
        invoiceId,
        newInvoiceNumber(),
        subscriptionId,
        plan.amount_santim,
        plan.currency,
        now,
        addInterval(now, plan.interval),
        now, // first invoice is due immediately
      ],
    );

    return { subscriptionId, invoiceId, orderId: null, plan };
  });

  const payment = await initiatePayment({
    userId: input.userId,
    planCode: input.planCode,
    gateway: input.gateway,
    idempotencyKey: input.idempotencyKey,
    invoiceId: prepared.invoiceId,
    orderId: prepared.orderId ?? undefined,
    customer: input.customer,
  });

  // Link the invoice to the order created by initiatePayment (first time only).
  await pool.query("UPDATE invoices SET order_id = COALESCE(order_id, $2), updated_at = now() WHERE id = $1", [
    prepared.invoiceId,
    payment.orderId,
  ]);

  return { subscriptionId: prepared.subscriptionId, invoiceId: prepared.invoiceId, payment };
}

/**
 * Called by the outbox when a subscription invoice is paid:
 * activate the subscription (or advance its period) and refresh entitlements.
 */
export async function applyPaidInvoice(client: pg.PoolClient, orderId: string): Promise<{
  subscriptionId: string;
  userId: string;
  entitlement: string;
  periodEnd: Date;
} | null> {
  const { rows } = await client.query(
    `SELECT i.id AS invoice_id, i.subscription_id, i.period_start, i.period_end, i.status,
            s.user_id, s.plan_code, p.entitlement, p.interval
     FROM invoices i
     JOIN subscriptions s ON s.id = i.subscription_id
     JOIN plans p ON p.code = s.plan_code
     WHERE i.order_id = $1
     FOR UPDATE OF i, s`,
    [orderId],
  );
  const row = rows[0];
  if (!row) return null; // not a subscription order
  if (row.status === "paid") {
    return {
      subscriptionId: row.subscription_id,
      userId: row.user_id,
      entitlement: row.entitlement,
      periodEnd: new Date(row.period_end),
    };
  }

  await client.query("UPDATE invoices SET status = 'paid', paid_at = now(), updated_at = now() WHERE id = $1", [
    row.invoice_id,
  ]);
  await client.query(
    `UPDATE subscriptions
     SET status = 'active', current_period_start = $2, current_period_end = $3,
         grace_until = NULL, updated_at = now()
     WHERE id = $1`,
    [row.subscription_id, row.period_start, row.period_end],
  );

  return {
    subscriptionId: row.subscription_id,
    userId: row.user_id,
    entitlement: row.entitlement,
    periodEnd: new Date(row.period_end),
  };
}

/**
 * Renewal worker: issue the next invoice for subscriptions approaching period end.
 * Also emits a notification outbox event (SMS/email delivery is a later integration).
 */
export async function issueRenewalInvoices(): Promise<number> {
  const leadMs = config.RENEWAL_LEAD_DAYS * 86_400_000;
  let issued = 0;

  const candidates = await pool.query(
    `SELECT s.id FROM subscriptions s
     WHERE s.status = 'active'
       AND s.current_period_end IS NOT NULL
       AND s.current_period_end < now() + $1::interval
       AND NOT EXISTS (
         SELECT 1 FROM invoices i
         WHERE i.subscription_id = s.id AND i.status IN ('open', 'overdue')
       )`,
    [`${Math.ceil(leadMs / 1000)} seconds`],
  );

  for (const candidate of candidates.rows) {
    await withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT s.id, s.user_id, s.plan_code, s.current_period_end, p.amount_santim, p.currency, p.interval
         FROM subscriptions s JOIN plans p ON p.code = s.plan_code
         WHERE s.id = $1 AND s.status = 'active' FOR UPDATE OF s`,
        [candidate.id],
      );
      const sub = rows[0];
      if (!sub) return;

      // Double-check inside the lock that no open invoice exists.
      const open = await client.query(
        "SELECT 1 FROM invoices WHERE subscription_id = $1 AND status IN ('open','overdue')",
        [sub.id],
      );
      if (open.rows.length > 0) return;

      const periodStart = new Date(sub.current_period_end);
      const periodEnd = addInterval(periodStart, sub.interval);
      const invoiceId = newUuid();
      await client.query(
        `INSERT INTO invoices (id, number, subscription_id, amount_santim, currency, period_start, period_end, due_at, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open')`,
        [invoiceId, newInvoiceNumber(), sub.id, sub.amount_santim, sub.currency, periodStart, periodEnd, periodStart],
      );
      await client.query("INSERT INTO outbox_events (type, payload) VALUES ('notify.renewal_due', $1)", [
        JSON.stringify({
          userId: sub.user_id,
          subscriptionId: sub.id,
          invoiceId,
          planCode: sub.plan_code,
          amountSantim: Number(sub.amount_santim),
          dueAt: periodStart.toISOString(),
        }),
      ]);
      issued += 1;
    });
  }

  return issued;
}

/**
 * Overdue worker: past-due invoices put the subscription into past_due with a
 * grace window; past the grace window the subscription expires and the
 * entitlement is revoked (via outbox).
 */
export async function enforceOverdueInvoices(): Promise<{ markedPastDue: number; expired: number }> {
  let markedPastDue = 0;
  let expired = 0;

  // 1. Open invoices past due -> overdue + subscription past_due + grace window.
  const overdue = await pool.query(
    "SELECT id FROM invoices WHERE status = 'open' AND due_at < now()",
  );
  for (const inv of overdue.rows) {
    await withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT i.id, i.subscription_id, s.status AS sub_status, s.user_id
         FROM invoices i JOIN subscriptions s ON s.id = i.subscription_id
         WHERE i.id = $1 AND i.status = 'open' FOR UPDATE OF i, s`,
        [inv.id],
      );
      const row = rows[0];
      if (!row) return;
      await client.query("UPDATE invoices SET status = 'overdue', updated_at = now() WHERE id = $1", [row.id]);
      if (row.sub_status === "active") {
        const graceUntil = new Date(Date.now() + config.GRACE_PERIOD_DAYS * 86_400_000);
        await client.query(
          "UPDATE subscriptions SET status = 'past_due', grace_until = $2, updated_at = now() WHERE id = $1",
          [row.subscription_id, graceUntil],
        );
        await client.query("INSERT INTO outbox_events (type, payload) VALUES ('notify.payment_overdue', $1)", [
          JSON.stringify({ userId: row.user_id, subscriptionId: row.subscription_id, graceUntil: graceUntil.toISOString() }),
        ]);
        markedPastDue += 1;
      }
    });
  }

  // 2. past_due beyond grace -> expired, revoke entitlement, void invoice.
  const lapsed = await pool.query(
    "SELECT id FROM subscriptions WHERE status = 'past_due' AND grace_until IS NOT NULL AND grace_until < now()",
  );
  for (const sub of lapsed.rows) {
    await withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT s.id, s.user_id, p.entitlement FROM subscriptions s
         JOIN plans p ON p.code = s.plan_code
         WHERE s.id = $1 AND s.status = 'past_due' FOR UPDATE OF s`,
        [sub.id],
      );
      const row = rows[0];
      if (!row) return;
      await client.query("UPDATE subscriptions SET status = 'expired', updated_at = now() WHERE id = $1", [row.id]);
      await client.query(
        "UPDATE invoices SET status = 'void', updated_at = now() WHERE subscription_id = $1 AND status = 'overdue'",
        [row.id],
      );
      await client.query("INSERT INTO outbox_events (type, payload) VALUES ('entitlement.revoke', $1)", [
        JSON.stringify({ userId: row.user_id, entitlement: row.entitlement, subscriptionId: row.id }),
      ]);
      expired += 1;
    });
  }

  return { markedPastDue, expired };
}

export async function cancelSubscription(subscriptionId: string, userId: string): Promise<void> {
  await withTransaction(async (client) => {
    const { rows } = await client.query(
      "SELECT id, status FROM subscriptions WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [subscriptionId, userId],
    );
    const sub = rows[0];
    if (!sub) throw new NotFoundError("Subscription not found");
    if (sub.status === "canceled" || sub.status === "expired") return;
    // Cancel at period end: keep entitlement until current_period_end; just stop renewing.
    await client.query(
      "UPDATE subscriptions SET status = 'canceled', canceled_at = now(), updated_at = now() WHERE id = $1",
      [subscriptionId],
    );
    await client.query(
      "UPDATE invoices SET status = 'void', updated_at = now() WHERE subscription_id = $1 AND status IN ('open','overdue')",
      [subscriptionId],
    );
  });
}

export async function listUserSubscriptions(userId: string) {
  const { rows } = await pool.query(
    `SELECT s.id, s.plan_code, p.name AS plan_name, s.status, s.current_period_start,
            s.current_period_end, s.grace_until, s.created_at
     FROM subscriptions s JOIN plans p ON p.code = s.plan_code
     WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
    [userId],
  );
  return rows;
}
