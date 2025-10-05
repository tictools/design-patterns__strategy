import { describe, expect, it } from "vitest";
import type { Order } from "../types";
import { VipStrategy } from "./VipStrategy";

describe("VipStrategy", () => {
  it("has a base 20% discount", () => {
    const strat = new VipStrategy();
    const order: Order = { clientType: "VIP", total: 100, itemsCount: 1 };
    expect(strat.calculate(order)).toBeCloseTo(0.2, 10);
  });

  it("adds 5% when itemsCount > 10", () => {
    const strat = new VipStrategy();
    const order: Order = { clientType: "VIP", total: 200, itemsCount: 11 };
    // 20% + 5% = 25% -> 0.25
    expect(strat.calculate(order)).toBeCloseTo(0.25, 10);
  });

  it("adds 10% extra when total > 500 and has loyalty card", () => {
    const strat = new VipStrategy();
    const order: Order = {
      clientType: "VIP",
      total: 600,
      itemsCount: 5,
      hasLoyaltyCard: true,
    };
    // 20% + 10% = 30% -> 0.3
    expect(strat.calculate(order)).toBeCloseTo(0.3, 10);
  });

  it("combines all bonuses when applicable", () => {
    const strat = new VipStrategy();
    const order: Order = {
      clientType: "VIP",
      total: 700,
      itemsCount: 12,
      hasLoyaltyCard: true,
    };
    // 20% +5% +10% = 35% -> 0.35
    expect(strat.calculate(order)).toBeCloseTo(0.35, 10);
  });

  it("does not add the items bonus when itemsCount is exactly 10", () => {
    const strat = new VipStrategy();
    const order: Order = { clientType: "VIP", total: 300, itemsCount: 10 };
    // only base 20%
    expect(strat.calculate(order)).toBeCloseTo(0.2, 10);
  });
});
