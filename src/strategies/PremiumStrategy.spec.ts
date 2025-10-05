import { describe, expect, it } from "vitest";
import type { Order } from "../types";
import { PremiumStrategy } from "./PremiumStrategy";

describe("PremiumStrategy", () => {
  it("has a base 10% discount", () => {
    const strategy = new PremiumStrategy();
    const order: Order = { clientType: "Premium", total: 100, itemsCount: 1 };
    expect(strategy.calculate(order)).toBeCloseTo(0.1, 10);
  });

  it("adds 5% when total > 200 and 2% for loyalty card", () => {
    const strategy = new PremiumStrategy();
    const order: Order = {
      clientType: "Premium",
      total: 250,
      itemsCount: 1,
      hasLoyaltyCard: true,
    };
    // 10% + 5% + 2% = 17% -> 0.17
    expect(strategy.calculate(order)).toBeCloseTo(0.17, 10);
  });
});
