import { randomBytes, randomUUID } from "node:crypto";

/**
 * Globally-unique, gateway-safe transaction reference.
 * Format: KNX-<millis base36>-<10 hex chars>, e.g. KNX-m3kq1z8a-4f9c2d1ab0
 * Chapa requires tx_ref to be unique per transaction forever; this guarantees it.
 */
export function newTxRef(): string {
  const time = Date.now().toString(36);
  const rand = randomBytes(5).toString("hex");
  return `KNX-${time}-${rand}`;
}

export function newUuid(): string {
  return randomUUID();
}

/** Human-facing invoice number, e.g. INV-2026-8F3A2C */
export function newInvoiceNumber(): string {
  const year = new Date().getUTCFullYear();
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `INV-${year}-${rand}`;
}
