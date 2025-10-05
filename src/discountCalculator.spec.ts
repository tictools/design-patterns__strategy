import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { calculateFinalPrice } from "./discountCalculator";
import { DiscountService } from "./services/DiscountService";
import { PremiumStrategy } from "./strategies/PremiumStrategy";
import { RegularStrategy } from "./strategies/RegularStrategy";
import { VipStrategy } from "./strategies/VipStrategy";
import type { Order } from "./types";

describe("calculateFinalPrice", () => {
  let discountService: DiscountService;
  beforeEach(() => {
    discountService = new DiscountService();
  });

  afterEach(() => {
    discountService.unregisterAllStrategies();
  });

  it("returns the same total for a Regular client with no discounts", () => {
    discountService.registerStrategy({
      key: "Regular",
      strategy: new RegularStrategy(),
    });

    const order: Order = { clientType: "Regular", total: 80, itemsCount: 3 };

    const finalPrice = calculateFinalPrice(order, discountService);

    expect(finalPrice).toBe(80);
  });

  it("applies all Regular discounts (total>100, items>5, loyalty card)", () => {
    discountService.registerStrategy({
      key: "Regular",
      strategy: new RegularStrategy(),
    });

    const order: Order = {
      clientType: "Regular",
      total: 150,
      itemsCount: 6,
      hasLoyaltyCard: true,
    };

    const finalPrice = calculateFinalPrice(order, discountService);

    expect(finalPrice).toBe(135);
  });

  it("applies only the >100 total discount for Regular when itemsCount is exactly boundary and no card", () => {
    discountService.registerStrategy({
      key: "Regular",
      strategy: new RegularStrategy(),
    });

    const order: Order = {
      clientType: "Regular",
      total: 101,
      itemsCount: 5,
    };

    const finalPrice = calculateFinalPrice(order, discountService);

    expect(finalPrice).toBe(95.95);
  });

  it("applies Premium discounts including loyalty and >200 total", () => {
    discountService.registerStrategy({
      key: "Premium",
      strategy: new PremiumStrategy(),
    });

    const order: Order = {
      clientType: "Premium",
      total: 250,
      itemsCount: 2,
      hasLoyaltyCard: true,
    };

    const finalPrice = calculateFinalPrice(order, discountService);

    expect(finalPrice).toBeCloseTo(207.5, 2);
  });

  it("rounds correctly to two decimals for Premium clients (includes >200 total rule)", () => {
    discountService.registerStrategy({
      key: "Premium",
      strategy: new PremiumStrategy(),
    });

    const order: Order = {
      clientType: "Premium",
      total: 333.33,
      itemsCount: 1,
    };

    const finalPrice = calculateFinalPrice(order, discountService);

    expect(finalPrice).toBe(283.33);
  });

  it("applies VIP discounts including itemsCount and loyalty+high-total bonus", () => {
    discountService.registerStrategy({
      key: "VIP",
      strategy: new VipStrategy(),
    });

    const order: Order = {
      clientType: "VIP",
      total: 600,
      itemsCount: 11,
      hasLoyaltyCard: true,
    };

    const finalPrice = calculateFinalPrice(order, discountService);

    expect(finalPrice).toBe(390);
  });

  it("treats omitted hasLoyaltyCard as false (no extra loyalty discount)", () => {
    discountService.registerStrategy({
      key: "Regular",
      strategy: new RegularStrategy(),
    });

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
    };

    const withCard = calculateFinalPrice(orderWithCard, discountService);
    const withoutCard = calculateFinalPrice(orderWithoutCard, discountService);

    expect(withCard).toBe(101.2);
    expect(withoutCard).toBe(104.5);
  });
});
