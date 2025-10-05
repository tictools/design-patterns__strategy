import { describe, expect, it } from "vitest";
import { calculateFinalPrice } from "./discountCalculator";
import { Order } from "./types";

describe("calculateFinalPrice", () => {
  it("returns the same total for a Regular client with no discounts", () => {
    const order: Order = { clientType: "Regular", total: 80, itemsCount: 3 };
    expect(calculateFinalPrice(order)).toBe(80);
  });

  it("applies all Regular discounts (total>100, items>5, loyalty card)", () => {
    const order: Order = {
      clientType: "Regular",
      total: 150,
      itemsCount: 6,
      hasLoyaltyCard: true,
    };
    // discounts: 5% + 2% + 3% = 10% -> 150 * 0.9 = 135.00
    expect(calculateFinalPrice(order)).toBe(135);
  });

  it("applies only the >100 total discount for Regular when itemsCount is exactly boundary and no card", () => {
    const order: Order = {
      clientType: "Regular",
      total: 101,
      itemsCount: 5, // boundary: >5 is required for the extra 2%
    };
    // discount: 5% -> 101 * 0.95 = 95.95
    expect(calculateFinalPrice(order)).toBe(95.95);
  });

  it("applies Premium discounts including loyalty and >200 total", () => {
    const order: Order = {
      clientType: "Premium",
      total: 250,
      itemsCount: 2,
      hasLoyaltyCard: true,
    };
    // discounts: 10% base +5% (total>200) +2% (card) = 17% -> 250 * 0.83 = 207.5
    expect(calculateFinalPrice(order)).toBeCloseTo(207.5, 2);
  });

  it("rounds correctly to two decimals for Premium clients (includes >200 total rule)", () => {
    const order: Order = {
      clientType: "Premium",
      total: 333.33,
      itemsCount: 1,
    };
    // discounts: 10% base +5% (total>200) = 15% -> 333.33 * 0.85 = 283.3305 -> rounded to 283.33
    expect(calculateFinalPrice(order)).toBe(283.33);
  });

  it("applies VIP discounts including itemsCount and loyalty+high-total bonus", () => {
    const order: Order = {
      clientType: "VIP",
      total: 600,
      itemsCount: 11,
      hasLoyaltyCard: true,
    };
    // discounts: 20% base +5% (items>10) +10% (total>500 && card) = 35% -> 600 * 0.65 = 390
    expect(calculateFinalPrice(order)).toBe(390);
  });

  it("falls back to no discount for unknown client types (unsafe fallback path)", () => {
    // bypass TypeScript's ClientType by casting to any to exercise the function's fallback
    const order: any = { clientType: "Unknown", total: 120, itemsCount: 4 };
    expect(calculateFinalPrice(order)).toBe(120);
  });

  it("treats omitted hasLoyaltyCard as false (no extra loyalty discount)", () => {
    const orderWithCard: Order = {
      clientType: "Regular",
      total: 110,
      itemsCount: 1,
      hasLoyaltyCard: true,
    };
    const orderWithoutCard: Order = {
      clientType: "Regular",
      total: 110,
      itemsCount: 1,
      // hasLoyaltyCard omitted
    };

    const withCard = calculateFinalPrice(orderWithCard); // 5% + 3% = 8% -> 110 * 0.92 = 101.2
    const withoutCard = calculateFinalPrice(orderWithoutCard); // 5% -> 110 * 0.95 = 104.5

    expect(withCard).toBe(101.2);
    expect(withoutCard).toBe(104.5);
  });
});
