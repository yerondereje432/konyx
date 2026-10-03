import { describe, expect, it } from "vitest";
import {
  TRANSACTION_STATUSES,
  assertTransition,
  canTransition,
  isTerminal,
} from "./stateMachine.js";

describe("payment state machine", () => {
  it("allows the happy path PENDING -> PROCESSING -> PAID", () => {
    expect(canTransition("PENDING", "PROCESSING")).toBe(true);
    expect(canTransition("PROCESSING", "PAID")).toBe(true);
  });

  it("allows settlement directly from PENDING (fast gateways)", () => {
    expect(canTransition("PENDING", "PAID")).toBe(true);
  });

  it("allows late settlement after expiry (slow Ethiopian gateway confirmations)", () => {
    expect(canTransition("EXPIRED", "PAID")).toBe(true);
  });

  it("never allows un-paying", () => {
    expect(canTransition("PAID", "PENDING")).toBe(false);
    expect(canTransition("PAID", "PROCESSING")).toBe(false);
    expect(canTransition("PAID", "FAILED")).toBe(false);
    expect(canTransition("PAID", "EXPIRED")).toBe(false);
  });

  it("only allows refund flow out of PAID", () => {
    expect(canTransition("PAID", "REFUND_PENDING")).toBe(true);
    expect(canTransition("PAID", "REFUNDED")).toBe(true);
    expect(canTransition("PROCESSING", "REFUNDED")).toBe(false);
    expect(canTransition("PENDING", "REFUND_PENDING")).toBe(false);
  });

  it("treats FAILED, EXPIRED->?, REFUNDED correctly as terminal/non-terminal", () => {
    expect(isTerminal("FAILED")).toBe(true);
    expect(isTerminal("REFUNDED")).toBe(true);
    expect(isTerminal("EXPIRED")).toBe(false); // can still become PAID
    expect(isTerminal("PAID")).toBe(false); // can still be refunded
  });

  it("rejects self-transitions", () => {
    for (const s of TRANSACTION_STATUSES) {
      expect(canTransition(s, s)).toBe(false);
    }
  });

  it("assertTransition throws on illegal moves", () => {
    expect(() => assertTransition("FAILED", "PAID")).toThrow(/Illegal/);
    expect(() => assertTransition("REFUNDED", "PAID")).toThrow(/Illegal/);
    expect(() => assertTransition("PROCESSING", "PAID")).not.toThrow();
  });
});
