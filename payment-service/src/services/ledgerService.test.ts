import { describe, expect, it } from "vitest";
import {
  assertBalanced,
  buildCaptureLines,
  buildRefundLines,
  entitlementRevenueAccount,
} from "./ledgerService.js";

describe("double-entry ledger construction", () => {
  it("builds a balanced capture journal without fees", () => {
    const lines = buildCaptureLines(45000, "revenue_job_posts");
    expect(() => assertBalanced(lines)).not.toThrow();
    expect(lines).toEqual([
      { accountCode: "gateway_receivable", direction: "debit", amountSantim: 45000 },
      { accountCode: "revenue_job_posts", direction: "credit", amountSantim: 45000 },
    ]);
  });

  it("builds a balanced capture journal with gateway fees", () => {
    // 1,450 ETB payment, 3.5% Chapa-style fee ≈ 50.75 ETB = 5075 santim
    const lines = buildCaptureLines(145000, "revenue_subscriptions", 5075);
    expect(() => assertBalanced(lines)).not.toThrow();
    const receivable = lines.find((l) => l.accountCode === "gateway_receivable")!;
    const fee = lines.find((l) => l.accountCode === "gateway_fees")!;
    expect(receivable.amountSantim).toBe(145000 - 5075);
    expect(fee.amountSantim).toBe(5075);
    // Net asset + fee expense = gross revenue
    expect(receivable.amountSantim + fee.amountSantim).toBe(145000);
  });

  it("ignores nonsensical fees (fee >= gross)", () => {
    const lines = buildCaptureLines(1000, "revenue_badges", 5000);
    expect(() => assertBalanced(lines)).not.toThrow();
    expect(lines.find((l) => l.accountCode === "gateway_fees")).toBeUndefined();
  });

  it("rejects zero/negative captures", () => {
    expect(() => buildCaptureLines(0, "revenue_job_posts")).toThrow();
    expect(() => buildCaptureLines(-100, "revenue_job_posts")).toThrow();
  });

  it("builds balanced refund journals", () => {
    const lines = buildRefundLines(45000);
    expect(() => assertBalanced(lines)).not.toThrow();
    expect(lines).toHaveLength(2);
  });

  it("detects unbalanced journals", () => {
    expect(() =>
      assertBalanced([
        { accountCode: "gateway_receivable", direction: "debit", amountSantim: 100 },
        { accountCode: "revenue_job_posts", direction: "credit", amountSantim: 99 },
      ]),
    ).toThrow(/Unbalanced/);
  });

  it("maps entitlements to the right revenue accounts", () => {
    expect(entitlementRevenueAccount("job_post_publish")).toBe("revenue_job_posts");
    expect(entitlementRevenueAccount("seeker_premium")).toBe("revenue_subscriptions");
    expect(entitlementRevenueAccount("employer_pro")).toBe("revenue_subscriptions");
    expect(entitlementRevenueAccount("gold_badge")).toBe("revenue_badges");
  });
});
