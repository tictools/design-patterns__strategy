import { describe, expect, it } from "vitest";
import type { Order } from "../types";
import { RegularStrategy } from "./RegularStrategy";

describe("RegularStrategy", () => {
  it("returns 0 when no discount rules apply", () => {
    const strategy = new RegularStrategy();
    const order: Order = { clientType: "Regular", total: 80, itemsCount: 3 };
    expect(strategy.calculate(order)).toBe(0);
  });

  it("calculates 10% when total>100, items>5 and has loyalty card", () => {
    const strategy = new RegularStrategy();
    const order: Order = {
      clientType: "Regular",
      total: 150,
      itemsCount: 6,
      hasLoyaltyCard: true,
    };
    // 5% + 2% + 3% = 10% -> 0.1
    expect(strategy.calculate(order)).toBeCloseTo(0.1, 10);
  });

  it("applies only the total>100 discount when itemsCount is exactly 5", () => {
    const strategy = new RegularStrategy();
    const order: Order = { clientType: "Regular", total: 101, itemsCount: 5 };
    // only 5% -> 0.05
    expect(strategy.calculate(order)).toBeCloseTo(0.05, 10);
  });
});
