import { describe, expect, it } from "vitest";
import { birrToSantim, formatSantim, santimToBirr, santimToGatewayAmount } from "./money.js";

describe("money (santim integer arithmetic)", () => {
  it("round-trips the Konyx price list exactly", () => {
    for (const birr of [150, 450, 1450, 1500, 14500]) {
      expect(santimToBirr(birrToSantim(birr))).toBe(birr);
    }
  });

  it("handles decimal birr without float drift", () => {
    expect(birrToSantim(450.0)).toBe(45000);
    expect(birrToSantim(0.1 + 0.2)).toBe(30); // classic float trap
    expect(birrToSantim(1450.75)).toBe(145075);
  });

  it("rejects negative and unsafe amounts", () => {
    expect(() => birrToSantim(-5)).toThrow();
    expect(() => birrToSantim(Number.MAX_SAFE_INTEGER)).toThrow();
  });

  it("formats for humans and for Chapa", () => {
    expect(formatSantim(45000)).toBe("450.00 ETB");
    expect(santimToGatewayAmount(145075)).toBe("1450.75");
  });
});
