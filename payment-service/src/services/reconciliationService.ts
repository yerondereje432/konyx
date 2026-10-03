import { pool } from "../db/pool.js";
import { expireStaleTransaction, settleByVerification } from "./paymentService.js";

export interface ReconciliationReport {
  checked: number;
  settled: number;
  failed: number;
  expired: number;
  refundsConfirmed: number;
  errors: Array<{ txRef: string; error: string }>;
}

/**
 * Reconciliation sweep — the safety net under webhooks.
 * For every non-terminal transaction, ask the gateway what REALLY happened:
 *  - confirmed paid   -> settle (ledger + fulfillment), even if the webhook was lost
 *  - confirmed failed -> mark failed
 *  - still pending past expiry -> expire locally (gateway can still flip it to PAID later)
 *  - refund pending   -> confirm refund when the gateway reports it
 */
export async function reconcilePendingTransactions(): Promise<ReconciliationReport> {
  const report: ReconciliationReport = {
    checked: 0,
    settled: 0,
    failed: 0,
    expired: 0,
    refundsConfirmed: 0,
    errors: [],
  };

  const { rows } = await pool.query(
    `SELECT tx_ref, status, expires_at FROM transactions
     WHERE status IN ('PENDING', 'PROCESSING', 'REFUND_PENDING')
     ORDER BY created_at
     LIMIT 200`,
  );

  for (const row of rows) {
    report.checked += 1;
    try {
      if (row.status === "REFUND_PENDING") {
        // Poll the gateway; Chapa reports refunded transactions via verify.
        const { confirmRefund } = await import("./paymentService.js");
        const outcome = await settleRefundIfConfirmed(row.tx_ref, confirmRefund);
        if (outcome) report.refundsConfirmed += 1;
        continue;
      }

      const outcome = await settleByVerification(row.tx_ref, "reconciliation");
      if (outcome.changed && outcome.status === "PAID") {
        report.settled += 1;
        continue;
      }
      if (outcome.changed && outcome.status === "FAILED") {
        report.failed += 1;
        continue;
      }
      // Unchanged and past expiry -> sweep to EXPIRED.
      if (!outcome.changed && row.expires_at && new Date(row.expires_at) < new Date()) {
        const didExpire = await expireStaleTransaction(row.tx_ref);
        if (didExpire) report.expired += 1;
      }
    } catch (err) {
      report.errors.push({ txRef: row.tx_ref, error: (err as Error).message });
    }
  }

  return report;
}

async function settleRefundIfConfirmed(
  txRef: string,
  confirmRefund: (txRef: string, source: string) => Promise<unknown>,
): Promise<boolean> {
  const { getGateway } = await import("../gateways/index.js");
  const { rows } = await pool.query("SELECT gateway FROM transactions WHERE tx_ref = $1", [txRef]);
  if (!rows[0]) return false;
  const verification = await getGateway(rows[0].gateway).verify(txRef);
  // Gateways report refunded transactions differently; treat explicit 'failed'
  // after a refund request OR a refunded flag in the raw payload as confirmation.
  const raw = JSON.stringify(verification.raw ?? {}).toLowerCase();
  if (raw.includes("refund") || verification.status === "failed") {
    await confirmRefund(txRef, "reconciliation");
    return true;
  }
  return false;
}

/** Ledger integrity check: every journal must balance. Returns violations. */
export async function ledgerIntegrityCheck(): Promise<Array<{ journal_id: string; debits: number; credits: number }>> {
  const { rows } = await pool.query(`
    SELECT j.id AS journal_id,
           COALESCE(SUM(e.amount_santim) FILTER (WHERE e.direction = 'debit'), 0)::bigint  AS debits,
           COALESCE(SUM(e.amount_santim) FILTER (WHERE e.direction = 'credit'), 0)::bigint AS credits
    FROM ledger_journals j
    LEFT JOIN ledger_entries e ON e.journal_id = j.id
    GROUP BY j.id
    HAVING COALESCE(SUM(e.amount_santim) FILTER (WHERE e.direction = 'debit'), 0)
        <> COALESCE(SUM(e.amount_santim) FILTER (WHERE e.direction = 'credit'), 0)
  `);
  return rows;
}
