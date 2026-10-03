import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAdmin } from "../auth/auth.js";
import { pool } from "../db/pool.js";
import { trialBalance } from "../services/ledgerService.js";
import {
  confirmRefund,
  requestRefund,
  settleByVerification,
} from "../services/paymentService.js";
import {
  ledgerIntegrityCheck,
  reconcilePendingTransactions,
} from "../services/reconciliationService.js";

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAdmin);

  app.get("/v1/admin/transactions", async (req) => {
    const { status, limit } = (req.query ?? {}) as { status?: string; limit?: string };
    const max = Math.min(Number(limit ?? 100), 500);
    const { rows } = status
      ? await pool.query(
          `SELECT t.tx_ref, t.status, t.amount_santim, t.currency, t.gateway, t.user_id,
                  t.failure_reason, t.paid_at, t.created_at, o.plan_code
           FROM transactions t JOIN orders o ON o.id = t.order_id
           WHERE t.status = $1 ORDER BY t.created_at DESC LIMIT $2`,
          [status.toUpperCase(), max],
        )
      : await pool.query(
          `SELECT t.tx_ref, t.status, t.amount_santim, t.currency, t.gateway, t.user_id,
                  t.failure_reason, t.paid_at, t.created_at, o.plan_code
           FROM transactions t JOIN orders o ON o.id = t.order_id
           ORDER BY t.created_at DESC LIMIT $1`,
          [max],
        );
    return { transactions: rows };
  });

  app.get("/v1/admin/transactions/:txRef/events", async (req) => {
    const { txRef } = req.params as { txRef: string };
    const { rows } = await pool.query(
      `SELECT e.from_status, e.to_status, e.source, e.detail, e.created_at
       FROM transaction_events e JOIN transactions t ON t.id = e.transaction_id
       WHERE t.tx_ref = $1 ORDER BY e.id`,
      [txRef],
    );
    return { events: rows };
  });

  /** Manual re-verification (support tooling for "I paid but nothing happened"). */
  app.post("/v1/admin/transactions/:txRef/reverify", async (req) => {
    const { txRef } = req.params as { txRef: string };
    return settleByVerification(txRef, "admin");
  });

  app.post("/v1/admin/transactions/:txRef/refund", async (req) => {
    const { txRef } = req.params as { txRef: string };
    const body = z.object({ reason: z.string().min(3).max(500) }).parse(req.body ?? {});
    return requestRefund(txRef, body.reason);
  });

  app.post("/v1/admin/transactions/:txRef/confirm-refund", async (req) => {
    const { txRef } = req.params as { txRef: string };
    return confirmRefund(txRef, "admin");
  });

  /** Run a reconciliation sweep on demand. */
  app.post("/v1/admin/reconcile", async () => {
    return reconcilePendingTransactions();
  });

  /** Financial reporting: trial balance + journal integrity. */
  app.get("/v1/admin/ledger/trial-balance", async () => {
    const accounts = await trialBalance(pool);
    const violations = await ledgerIntegrityCheck();
    return { accounts, unbalancedJournals: violations };
  });

  app.get("/v1/admin/webhooks", async (req) => {
    const { limit } = (req.query ?? {}) as { limit?: string };
    const { rows } = await pool.query(
      `SELECT gateway, tx_ref, signature_ok, processed_at, error, received_at
       FROM webhook_events ORDER BY id DESC LIMIT $1`,
      [Math.min(Number(limit ?? 50), 500)],
    );
    return { webhooks: rows };
  });
}
