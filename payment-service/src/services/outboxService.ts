import { withTransaction } from "../db/pool.js";
import { newUuid } from "../lib/ids.js";
import { applyPaidInvoice } from "./subscriptionService.js";

const MAX_ATTEMPTS = 10;

/**
 * Outbox dispatcher: delivers entitlements and notifications exactly-once-ish.
 * Events are written in the SAME DB transaction that records money movement,
 * so fulfillment can lag but can never be lost.
 */
export async function dispatchOutbox(): Promise<number> {
  let processed = 0;
  // Process in small batches; each event gets its own transaction + row lock
  // (SKIP LOCKED makes this safe to run from multiple instances).
  for (let i = 0; i < 20; i++) {
    const handled = await withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT id, type, payload, attempts FROM outbox_events
         WHERE processed_at IS NULL AND next_attempt_at <= now() AND attempts < $1
         ORDER BY id
         LIMIT 1
         FOR UPDATE SKIP LOCKED`,
        [MAX_ATTEMPTS],
      );
      const event = rows[0];
      if (!event) return false;

      try {
        await handleEvent(client, event.type as string, event.payload);
        await client.query("UPDATE outbox_events SET processed_at = now(), last_error = NULL WHERE id = $1", [
          event.id,
        ]);
      } catch (err) {
        const attempts = Number(event.attempts) + 1;
        const backoffSeconds = Math.min(3600, 2 ** attempts * 5);
        await client.query(
          `UPDATE outbox_events
           SET attempts = $2, last_error = $3, next_attempt_at = now() + ($4 || ' seconds')::interval
           WHERE id = $1`,
          [event.id, attempts, (err as Error).message, String(backoffSeconds)],
        );
      }
      return true;
    });
    if (!handled) break;
    processed += 1;
  }
  return processed;
}

async function handleEvent(
  client: import("pg").PoolClient,
  type: string,
  payload: Record<string, any>,
): Promise<void> {
  switch (type) {
    case "entitlement.grant": {
      await grantEntitlement(client, payload);
      return;
    }
    case "entitlement.revoke": {
      await client.query(
        `UPDATE user_entitlements SET active = FALSE, revoked_at = now()
         WHERE user_id = $1 AND entitlement = $2 AND active`,
        [payload.userId, payload.entitlement],
      );
      // Revoking a job post entitlement (refund) also unpublishes the post.
      if (payload.entitlement === "job_post_publish" && payload.referenceId) {
        await client.query("UPDATE job_posts SET status = 'archived' WHERE id = $1", [payload.referenceId]);
      }
      return;
    }
    case "notify.renewal_due":
    case "notify.payment_overdue": {
      // Delivery channel (SMS via Ethio Telecom, Telegram bot, email) is a
      // follow-up integration; the event is recorded so no notification is lost.
      // eslint-disable-next-line no-console
      console.log(`[notify] ${type}`, JSON.stringify(payload));
      return;
    }
    default:
      throw new Error(`Unknown outbox event type: ${type}`);
  }
}

async function grantEntitlement(client: import("pg").PoolClient, payload: Record<string, any>): Promise<void> {
  let expiresAt: Date | null = null;
  let referenceId: string | null = payload.referenceId ?? null;

  if (payload.planKind === "subscription") {
    // Activate / advance the subscription first; entitlement expiry = period end.
    const applied = await applyPaidInvoice(client, payload.orderId);
    if (applied) expiresAt = applied.periodEnd;
  }

  if (payload.entitlement === "job_post_publish" && referenceId) {
    await client.query(
      "UPDATE job_posts SET status = 'published', published_at = now() WHERE id = $1 AND status = 'draft'",
      [referenceId],
    );
  }

  // Idempotent grant: one active row per (user, entitlement, source transaction).
  const existing = await client.query(
    "SELECT id FROM user_entitlements WHERE source_transaction_id = $1",
    [payload.transactionId],
  );
  if (existing.rows.length > 0) {
    if (expiresAt) {
      await client.query("UPDATE user_entitlements SET expires_at = $2, active = TRUE WHERE id = $1", [
        existing.rows[0].id,
        expiresAt,
      ]);
    }
    return;
  }

  // For subscription renewals, deactivate the previous period's entitlement row.
  if (payload.planKind === "subscription") {
    await client.query(
      "UPDATE user_entitlements SET active = FALSE WHERE user_id = $1 AND entitlement = $2 AND active",
      [payload.userId, payload.entitlement],
    );
  }

  await client.query(
    `INSERT INTO user_entitlements (id, user_id, entitlement, reference_id, active, expires_at, source_transaction_id)
     VALUES ($1, $2, $3, $4, TRUE, $5, $6)`,
    [newUuid(), payload.userId, payload.entitlement, referenceId, expiresAt, payload.transactionId],
  );
}
