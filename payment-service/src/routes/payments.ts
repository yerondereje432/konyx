import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireUser } from "../auth/auth.js";
import { pool } from "../db/pool.js";
import { availableGateways } from "../gateways/index.js";
import {
  getTransactionForUser,
  initiatePayment,
  settleByVerification,
} from "../services/paymentService.js";

const InitiateBody = z.object({
  planCode: z.string().min(1),
  gateway: z.string().optional(),
  idempotencyKey: z.string().min(8).max(128).optional(),
  jobDraft: z
    .object({
      title: z.string().min(3).max(200),
      payload: z.record(z.unknown()).optional(),
    })
    .optional(),
  customer: z
    .object({
      email: z.string().email().optional(),
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
      phone: z.string().max(20).optional(),
    })
    .optional(),
});

export async function paymentRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireUser);

  /** Catalog of purchasable plans (public-ish, but auth keeps scrapers out). */
  app.get("/v1/plans", async () => {
    const { rows } = await pool.query(
      "SELECT code, name, kind, amount_santim, currency, interval, entitlement FROM plans WHERE active ORDER BY amount_santim",
    );
    return { plans: rows, gateways: availableGateways() };
  });

  /** Start a one-time payment (job post, badge). Returns a checkout URL. */
  app.post("/v1/payments/initiate", async (req, reply) => {
    const body = InitiateBody.parse(req.body);
    const idempotencyHeader = req.headers["idempotency-key"];
    const result = await initiatePayment({
      userId: req.user!.id,
      planCode: body.planCode,
      gateway: body.gateway,
      idempotencyKey:
        body.idempotencyKey ??
        (Array.isArray(idempotencyHeader) ? idempotencyHeader[0] : idempotencyHeader),
      jobDraft: body.jobDraft,
      customer: body.customer,
    });
    reply.code(result.reused ? 200 : 201);
    return result;
  });

  /** Poll payment status (frontend return page calls this). */
  app.get("/v1/payments/:txRef", async (req) => {
    const { txRef } = req.params as { txRef: string };
    return getTransactionForUser(txRef, req.user!.id);
  });

  /**
   * Force a server-side verification against the gateway.
   * The frontend calls this when the customer lands on the return URL, so the
   * UI reflects reality immediately instead of waiting for the webhook.
   */
  app.post("/v1/payments/:txRef/verify", async (req) => {
    const { txRef } = req.params as { txRef: string };
    // Ownership check first.
    await getTransactionForUser(txRef, req.user!.id);
    const outcome = await settleByVerification(txRef, "verify_api");
    return outcome;
  });

  /** User's payment history. */
  app.get("/v1/payments", async (req) => {
    const { rows } = await pool.query(
      `SELECT t.tx_ref, t.status, t.amount_santim, t.currency, t.gateway, t.paid_at, t.created_at, o.plan_code
       FROM transactions t JOIN orders o ON o.id = t.order_id
       WHERE t.user_id = $1 ORDER BY t.created_at DESC LIMIT 100`,
      [req.user!.id],
    );
    return { transactions: rows };
  });

  /** The user's current entitlements (what they've paid for). */
  app.get("/v1/entitlements", async (req) => {
    const { rows } = await pool.query(
      `SELECT entitlement, reference_id, granted_at, expires_at
       FROM user_entitlements
       WHERE user_id = $1 AND active AND (expires_at IS NULL OR expires_at > now())`,
      [req.user!.id],
    );
    return { entitlements: rows };
  });
}
