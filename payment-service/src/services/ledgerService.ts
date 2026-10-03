import type pg from "pg";
import { newUuid } from "../lib/ids.js";

export interface LedgerLine {
  accountCode: string;
  direction: "debit" | "credit";
  amountSantim: number;
}

export function entitlementRevenueAccount(entitlement: string): string {
  switch (entitlement) {
    case "job_post_publish":
      return "revenue_job_posts";
    case "seeker_premium":
    case "employer_pro":
      return "revenue_subscriptions";
    case "gold_badge":
      return "revenue_badges";
    default:
      return "revenue_job_posts";
  }
}

/** Pure function: build balanced journal lines for a captured payment. */
export function buildCaptureLines(amountSantim: number, revenueAccount: string, feeSantim = 0): LedgerLine[] {
  if (amountSantim <= 0) throw new Error("Capture amount must be positive");
  if (feeSantim < 0 || feeSantim >= amountSantim) {
    // A fee >= the gross amount is a data error from the gateway; record no fee.
    feeSantim = 0;
  }
  const lines: LedgerLine[] = [
    { accountCode: "gateway_receivable", direction: "debit", amountSantim: amountSantim - feeSantim },
    { accountCode: revenueAccount, direction: "credit", amountSantim },
  ];
  if (feeSantim > 0) {
    lines.push({ accountCode: "gateway_fees", direction: "debit", amountSantim: feeSantim });
  }
  return lines;
}

/** Pure function: build balanced journal lines for a refund. */
export function buildRefundLines(amountSantim: number): LedgerLine[] {
  if (amountSantim <= 0) throw new Error("Refund amount must be positive");
  return [
    { accountCode: "refunds", direction: "debit", amountSantim },
    { accountCode: "gateway_receivable", direction: "credit", amountSantim },
  ];
}

export function assertBalanced(lines: LedgerLine[]): void {
  const debits = lines.filter((l) => l.direction === "debit").reduce((s, l) => s + l.amountSantim, 0);
  const credits = lines.filter((l) => l.direction === "credit").reduce((s, l) => s + l.amountSantim, 0);
  if (debits !== credits) {
    throw new Error(`Unbalanced journal: debits=${debits} credits=${credits}`);
  }
}

/** Persist a balanced journal inside the caller's DB transaction. */
export async function postJournal(
  client: pg.PoolClient,
  params: {
    transactionId: string | null;
    kind: "payment_captured" | "refund" | "fee" | "adjustment";
    memo: string;
    lines: LedgerLine[];
  },
): Promise<string> {
  assertBalanced(params.lines);
  const journalId = newUuid();
  await client.query(
    "INSERT INTO ledger_journals (id, transaction_id, kind, memo) VALUES ($1, $2, $3, $4)",
    [journalId, params.transactionId, params.kind, params.memo],
  );
  for (const line of params.lines) {
    await client.query(
      `INSERT INTO ledger_entries (journal_id, account_id, direction, amount_santim)
       VALUES ($1, (SELECT id FROM ledger_accounts WHERE code = $2), $3, $4)`,
      [journalId, line.accountCode, line.direction, line.amountSantim],
    );
  }
  return journalId;
}

/** Trial balance: per-account debit/credit totals. Used by admin + reconciliation. */
export async function trialBalance(client: pg.Pool | pg.PoolClient): Promise<
  Array<{ code: string; name: string; type: string; debits: number; credits: number }>
> {
  const { rows } = await client.query(`
    SELECT a.code, a.name, a.type,
           COALESCE(SUM(e.amount_santim) FILTER (WHERE e.direction = 'debit'), 0)::bigint  AS debits,
           COALESCE(SUM(e.amount_santim) FILTER (WHERE e.direction = 'credit'), 0)::bigint AS credits
    FROM ledger_accounts a
    LEFT JOIN ledger_entries e ON e.account_id = a.id
    GROUP BY a.id ORDER BY a.id
  `);
  return rows;
}
