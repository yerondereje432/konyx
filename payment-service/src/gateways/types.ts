/**
 * Provider-agnostic gateway contract.
 * Phase 1 ships ChapaGateway (aggregates Telebirr / CBE Birr / M-Pesa / Amole)
 * and MockGateway (development). Direct TelebirrGateway / CbeBirrGateway
 * implementations slot in behind this same interface later.
 */

export interface InitiateParams {
  txRef: string;
  amountSantim: number;
  currency: string;
  customer: { email?: string; firstName?: string; lastName?: string; phone?: string };
  title: string;
  callbackUrl: string; // server-to-server webhook/callback
  returnUrl: string; // browser redirect after checkout
}

export interface InitiateResult {
  checkoutUrl: string;
  gatewayTxId?: string;
  raw: unknown;
}

export type GatewayVerificationStatus = "success" | "failed" | "pending" | "not_found";

export interface VerifyResult {
  status: GatewayVerificationStatus;
  /** Amount the gateway says was actually paid, in santim. */
  amountSantim?: number;
  currency?: string;
  gatewayTxId?: string;
  feeSantim?: number;
  raw: unknown;
}

export interface RefundResult {
  accepted: boolean;
  raw: unknown;
}

export interface PaymentGateway {
  readonly name: string;
  initiate(params: InitiateParams): Promise<InitiateResult>;
  /** Source of truth. Webhooks are hints; this call decides. */
  verify(txRef: string): Promise<VerifyResult>;
  refund(txRef: string, reason?: string): Promise<RefundResult>;
  /** Verify a webhook signature against the raw request body. */
  verifyWebhookSignature(rawBody: string, headers: Record<string, string | string[] | undefined>): boolean;
}
