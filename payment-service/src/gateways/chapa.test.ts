import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

// Configure env BEFORE importing modules that read config.
process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";
process.env.CHAPA_WEBHOOK_SECRET = "whsec_test_secret";

const { ChapaGateway, safeCompare } = await import("./chapa.js");

describe("Chapa webhook signature verification", () => {
  const gateway = new ChapaGateway();
  const body = JSON.stringify({ tx_ref: "KNX-abc-123", status: "success" });
  const validSig = createHmac("sha256", "whsec_test_secret").update(body).digest("hex");

  it("accepts a valid chapa-signature header", () => {
    expect(gateway.verifyWebhookSignature(body, { "chapa-signature": validSig })).toBe(true);
  });

  it("accepts a valid x-chapa-signature header", () => {
    expect(gateway.verifyWebhookSignature(body, { "x-chapa-signature": validSig })).toBe(true);
  });

  it("rejects a tampered body", () => {
    const tampered = body.replace("success", "failed!");
    expect(gateway.verifyWebhookSignature(tampered, { "chapa-signature": validSig })).toBe(false);
  });

  it("rejects a wrong signature", () => {
    expect(gateway.verifyWebhookSignature(body, { "chapa-signature": "deadbeef".repeat(8) })).toBe(false);
  });

  it("rejects when no signature header is present", () => {
    expect(gateway.verifyWebhookSignature(body, {})).toBe(false);
  });

  it("uses constant-time comparison semantics", () => {
    expect(safeCompare("abc", "abc")).toBe(true);
    expect(safeCompare("abc", "abd")).toBe(false);
    expect(safeCompare("abc", "abcd")).toBe(false);
  });
});
