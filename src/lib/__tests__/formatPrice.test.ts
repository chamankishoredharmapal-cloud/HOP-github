import { describe, expect, it } from "vitest";
import { formatPaise, formatRupees } from "../formatPrice";

describe("formatPrice", () => {
  it("formats paise payloads as INR (single primitive for PDP/PLP/cart lines)", () => {
    expect(formatPaise(259900)).toBe("₹ 2,599");
  });

  it("formats rupee cart totals with the same locale (no second source)", () => {
    expect(formatRupees(2599)).toBe("₹ 2,599");
  });

  it("keeps line and total representations consistent", () => {
    expect(formatPaise(259900)).toBe(formatRupees(2599));
  });
});
