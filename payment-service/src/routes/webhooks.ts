import { createHash } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { pool } from "../db/pool.js";
import { getGateway } from "../gateways/index.js";
import { settleByVerification } from "../services/paymentService.js";

/**
 * Webhook intake. Principles:
 *  1. Always 200 fast (gateways retry on non-2xx; we never want retry storms
 *     for payloads we already stored).
 *  2. Verify signature; record the result either way.
 *  3. Dedupe on a content hash — Ethiopian gateways re-send webhooks.
 *  4. NEVER trust the payload for money decisions: the webhook only tells us
 *     WHICH tx_ref to re-verify server-side. settleByVerification() decides.
 */
export async function webhookRoutes(app: FastifyInstance): Promise<void> {
  // Keep the raw body for signature verification (scoped to this plugin).
  app.addContentTypeParser("application/json", { parseAs: "string" }, (_req, body, done) => {
    done(null, body);
  });

  app.post("/v1/webhooks/:gateway", async (req, reply) => {
    const { gateway: gatewayName } = req.params as { gateway: string };
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});

    let gateway;
    try {
      gateway = getGateway(gatewayName);
    } catch {
      return reply.code(404).send({ error: "unknown gateway" });
    }

    const signatureOk = gateway.verifyWebhookSignature(rawBody, req.headers);

    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      /* keep empty payload; still record the event */
    }

    const txRef =
      (payload["tx_ref"] as string | undefined) ??
      (payload["trx_ref"] as string | undefined) ??
      ((payload["data"] as Record<string, unknown> | undefined)?.["tx_ref"] as string | undefined);

    const dedupeKey = createHash("sha256").update(`${gatewayName}:${rawBody}`).digest("hex");

    const inserted = await pool.query(
      `INSERT INTO webhook_events (gateway, dedupe_key, tx_ref, signature_ok, payload)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (gateway, dedupe_key) DO NOTHING
       RETURNING id`,
      [gatewayName, dedupeKey, txRef ?? null, signatureOk, JSON.stringify(payload)],
    );

    // Duplicate webhook: acknowledge and stop.
    if (inserted.rows.length === 0) return reply.code(200).send({ received: true, duplicate: true });
    const eventId = inserted.rows[0].id;

    if (!signatureOk) {
      await pool.query("UPDATE webhook_events SET error = 'invalid signature' WHERE id = $1", [eventId]);
      // 200 on purpose: do not teach attackers which signatures fail.
      return reply.code(200).send({ received: true });
    }

    if (!txRef) {
      await pool.query("UPDATE webhook_events SET error = 'no tx_ref in payload' WHERE id = $1", [eventId]);
      return reply.code(200).send({ received: true });
    }

    // Settle asynchronously-ish but within this request (fast: one verify call).
    try {
      await settleByVerification(txRef, "webhook");
      await pool.query("UPDATE webhook_events SET processed_at = now() WHERE id = $1", [eventId]);
    } catch (err) {
      // Reconciliation will retry; record the error.
      await pool.query("UPDATE webhook_events SET error = $2 WHERE id = $1", [eventId, (err as Error).message]);
    }

    return reply.code(200).send({ received: true });
  });
}
