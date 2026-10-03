import { config } from "../config.js";
import { pool } from "../db/pool.js";
import type {
  InitiateParams,
  InitiateResult,
  PaymentGateway,
  RefundResult,
  VerifyResult,
} from "./types.js";

/**
 * Development gateway: no real money. Serves a hosted "checkout page" from
 * this service (/mock/checkout/:tx_ref) with Pay / Fail buttons, and records
 * outcomes in the mock_gateway_payments table so verify() behaves exactly
 * like a real gateway (webhook = hint, verify = truth).
 */
export class MockGateway implements PaymentGateway {
  readonly name = "mock";

  async initiate(params: InitiateParams): Promise<InitiateResult> {
    await pool.query(
      `INSERT INTO mock_gateway_payments (tx_ref, status, amount_santim, currency)
       VALUES ($1, 'pending', $2, $3)
       ON CONFLICT (tx_ref) DO NOTHING`,
      [params.txRef, params.amountSantim, params.currency],
    );
    return {
      checkoutUrl: `${config.PUBLIC_BASE_URL}/mock/checkout/${encodeURIComponent(params.txRef)}`,
      raw: { mock: true },
    };
  }

  async verify(txRef: string): Promise<VerifyResult> {
    const { rows } = await pool.query(
      "SELECT status, amount_santim, currency FROM mock_gateway_payments WHERE tx_ref = $1",
      [txRef],
    );
    const row = rows[0];
    if (!row) return { status: "not_found", raw: { mock: true } };
    const status: VerifyResult["status"] =
      row.status === "success" ? "success" : row.status === "failed" ? "failed" : "pending";
    return {
      status,
      amountSantim: Number(row.amount_santim),
      currency: row.currency,
      gatewayTxId: `MOCK-${txRef}`,
      feeSantim: 0,
      raw: { mock: true, status: row.status },
    };
  }

  async refund(txRef: string): Promise<RefundResult> {
    await pool.query("UPDATE mock_gateway_payments SET status = 'pending', updated_at = now() WHERE tx_ref = $1", [
      txRef,
    ]);
    return { accepted: true, raw: { mock: true } };
  }

  verifyWebhookSignature(): boolean {
    // The mock gateway only "sends webhooks" via internal calls; always trusted in dev.
    return config.NODE_ENV !== "production";
  }
}
