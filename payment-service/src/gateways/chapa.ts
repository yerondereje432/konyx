import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "../config.js";
import { GatewayError } from "../lib/errors.js";
import { birrToSantim, santimToGatewayAmount } from "../lib/money.js";
import type {
  InitiateParams,
  InitiateResult,
  PaymentGateway,
  RefundResult,
  VerifyResult,
} from "./types.js";

/**
 * Chapa (https://developer.chapa.co) — Ethiopian payment aggregator.
 * One integration covers Telebirr, CBE Birr, M-Pesa, Amole, cards.
 *
 * - initialize: POST /transaction/initialize  -> data.checkout_url
 * - verify:     GET  /transaction/verify/:tx_ref -> data.status success|failed|pending
 * - webhook:    HMAC-SHA256 of raw body with your webhook secret, sent in the
 *               `chapa-signature` / `x-chapa-signature` headers.
 */
export class ChapaGateway implements PaymentGateway {
  readonly name = "chapa";

  private get secretKey(): string {
    if (!config.CHAPA_SECRET_KEY) throw new GatewayError("CHAPA_SECRET_KEY is not configured");
    return config.CHAPA_SECRET_KEY;
  }

  private async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${config.CHAPA_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
    });

    let json: unknown;
    try {
      json = await res.json();
    } catch {
      throw new GatewayError(`Chapa returned non-JSON response (HTTP ${res.status})`);
    }
    return json as T;
  }

  async initiate(params: InitiateParams): Promise<InitiateResult> {
    type ChapaInit = {
      status: string;
      message?: string;
      data?: { checkout_url?: string } | null;
    };

    const payload: Record<string, string> = {
      amount: santimToGatewayAmount(params.amountSantim),
      currency: params.currency,
      tx_ref: params.txRef,
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      "customization[title]": params.title.slice(0, 16), // Chapa caps the title length
    };
    if (params.customer.email) payload.email = params.customer.email;
    if (params.customer.firstName) payload.first_name = params.customer.firstName;
    if (params.customer.lastName) payload.last_name = params.customer.lastName;
    if (params.customer.phone) payload.phone_number = params.customer.phone;

    const res = await this.request<ChapaInit>("POST", "/transaction/initialize", payload);

    if (res.status !== "success" || !res.data?.checkout_url) {
      throw new GatewayError(`Chapa initialize failed: ${res.message ?? "unknown error"}`);
    }
    return { checkoutUrl: res.data.checkout_url, raw: res };
  }

  async verify(txRef: string): Promise<VerifyResult> {
    type ChapaVerify = {
      status: string;
      message?: string;
      data?: {
        status?: string; // success | failed | pending
        amount?: number | string;
        currency?: string;
        charge?: number | string;
        reference?: string;
      } | null;
    };

    const res = await this.request<ChapaVerify>("GET", `/transaction/verify/${encodeURIComponent(txRef)}`);

    if (res.status !== "success" || !res.data) {
      // Chapa answers with a failure envelope for unknown tx_refs
      return { status: "not_found", raw: res };
    }

    const d = res.data;
    const gatewayStatus = (d.status ?? "").toLowerCase();
    const status: VerifyResult["status"] =
      gatewayStatus === "success" ? "success" : gatewayStatus === "failed" ? "failed" : "pending";

    return {
      status,
      amountSantim: d.amount !== undefined ? birrToSantim(Number(d.amount)) : undefined,
      currency: d.currency,
      gatewayTxId: d.reference,
      feeSantim: d.charge !== undefined ? birrToSantim(Number(d.charge)) : undefined,
      raw: res,
    };
  }

  async refund(txRef: string, reason?: string): Promise<RefundResult> {
    type ChapaRefund = { status: string; message?: string };
    const res = await this.request<ChapaRefund>("POST", `/refund/${encodeURIComponent(txRef)}`, {
      reason: reason ?? "Requested by Konyx admin",
    });
    return { accepted: res.status === "success", raw: res };
  }

  verifyWebhookSignature(rawBody: string, headers: Record<string, string | string[] | undefined>): boolean {
    const secret = config.CHAPA_WEBHOOK_SECRET;
    if (!secret) return false; // no secret configured => never trust webhooks

    const provided = firstHeader(headers["chapa-signature"]) ?? firstHeader(headers["x-chapa-signature"]);
    if (!provided) return false;

    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    return safeCompare(provided, expected);
  }
}

function firstHeader(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export function safeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}
