import { IllegalTransitionError } from "../lib/errors.js";

export const TRANSACTION_STATUSES = [
  "PENDING", // created locally, not yet handed to the gateway
  "PROCESSING", // gateway checkout issued, awaiting customer action
  "PAID", // confirmed by server-side verification against the gateway
  "FAILED", // gateway reported failure / amount mismatch
  "EXPIRED", // customer never completed; swept by reconciliation
  "REFUND_PENDING", // refund requested at gateway, awaiting confirmation
  "REFUNDED", // refund confirmed
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

/**
 * The only legal transitions. Everything else throws.
 * Terminal states: FAILED, EXPIRED, REFUNDED.
 * Note: EXPIRED -> PAID is intentionally allowed — Ethiopian gateways sometimes
 * confirm long after our expiry sweep; money received must always be recorded.
 */
const LEGAL: Record<TransactionStatus, readonly TransactionStatus[]> = {
  PENDING: ["PROCESSING", "PAID", "FAILED", "EXPIRED"],
  PROCESSING: ["PAID", "FAILED", "EXPIRED"],
  PAID: ["REFUND_PENDING", "REFUNDED"],
  EXPIRED: ["PAID"],
  FAILED: [],
  REFUND_PENDING: ["REFUNDED", "PAID"], // PAID = refund rejected by gateway
  REFUNDED: [],
};

export function canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  if (from === to) return false;
  return LEGAL[from].includes(to);
}

export function assertTransition(from: TransactionStatus, to: TransactionStatus): void {
  if (!canTransition(from, to)) throw new IllegalTransitionError(from, to);
}

export function isTerminal(status: TransactionStatus): boolean {
  return LEGAL[status].length === 0;
}

export function isSettleable(status: TransactionStatus): boolean {
  return canTransition(status, "PAID");
}
