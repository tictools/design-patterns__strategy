// tests/discountService.spec.ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ClientType, DiscountStrategy, Order } from "../types";
import { DiscountService } from "./DiscountService";

/**
 * Mock strategies senzilles per als tests
 */
class MockStrategy implements DiscountStrategy {
  constructor(private pct: number) {}
  calculate() {
    return this.pct;
  }
}

class CompositeStrategy implements DiscountStrategy {
  calculate(order: Order) {
    let percentage = 0;

    if (order.total > 100) percentage += 0.05;
    if (order.itemsCount > 3) percentage += 0.02;
    if (order.hasLoyaltyCard) percentage += 0.03;

    return percentage;
  }
}

/**
 * Helper to round to cents (same logic as the service)
 * Used to validate expected values in asserts.
 */
const roundToCents = (amount: number) => Math.round(amount * 100) / 100;

describe("DiscountService (contract tests)", () => {
  let service: DiscountService;

  beforeEach(() => {
    service = new DiscountService();
  });

  afterEach(() => {
    service.unregisterAllStrategies();
  });

  it("applies the registered strategy according to clientType", () => {
    service.registerStrategy({
      key: "Regular" as ClientType,
      strategy: new MockStrategy(0.1),
    });

    const order: Order = { clientType: "Regular", total: 200, itemsCount: 1 };

    const { finalPrice } = service.calculateFinalPrice({ order });

    expect(finalPrice).toBe(roundToCents(200 * (1 - 0.1)));
  });

  it("if there is no strategy registered for clientType, applies 0 discount", () => {
    const order: Order = { clientType: "Premium", total: 120, itemsCount: 2 };

    const { finalPrice } = service.calculateFinalPrice({ order });

    expect(finalPrice).toBe(roundToCents(120));
  });

  it("unregisterStrategy removes a strategy and falls back to 0", () => {
    service.registerStrategy({
      key: "VIP",
      strategy: new MockStrategy(0.2),
    });

    const order: Order = { clientType: "VIP", total: 100, itemsCount: 1 };

    const finalPriceAfterRegisteringStrategy = service.calculateFinalPrice({
      order,
    }).finalPrice;
    expect(finalPriceAfterRegisteringStrategy).toBe(
      roundToCents(100 * (1 - 0.2))
    );

    service.unregisterStrategy({ key: "VIP" });

    const finalPriceAfterUnregisteringStrategy = service.calculateFinalPrice({
      order,
    }).finalPrice;
    expect(finalPriceAfterUnregisteringStrategy).toBe(roundToCents(100)); // ara sense descompte
  });

  it("unregisterAllStrategies clears all strategies", () => {
    service.registerStrategy({
      key: "Regular",
      strategy: new MockStrategy(0.05),
    });

    service.registerStrategy({
      key: "Premium",
      strategy: new MockStrategy(0.1),
    });

    const finalPriceAfterRegisteringStrategy = service.calculateFinalPrice({
      order: { clientType: "Regular", total: 50, itemsCount: 1 },
    }).finalPrice;
    expect(finalPriceAfterRegisteringStrategy).toBe(
      roundToCents(50 * (1 - 0.05))
    );

    service.unregisterAllStrategies();

    const finalPriceAfterUnregisteringStrategy = service.calculateFinalPrice({
      order: { clientType: "Regular", total: 50, itemsCount: 1 },
    }).finalPrice;
    expect(finalPriceAfterUnregisteringStrategy).toBe(50);
  });

  it("throws an error if calculateFinalPrice receives a falsy order", () => {
    expect(() =>
      service.calculateFinalPrice({ order: null as unknown as never })
    ).toThrow("Order required");
  });

  it("throws an error if an invalid strategy (key or strategy) is registered", () => {
    // invalid key
    expect(() =>
      service.registerStrategy({
        key: "" as unknown as never,
        strategy: new MockStrategy(0.1),
      })
    ).toThrow("Invalid strategy registration");

    // invalid strategy
    expect(() =>
      service.registerStrategy({
        key: "Regular",
        strategy: null as unknown as never,
      })
    ).toThrow("Invalid strategy registration");
  });

  it("takes in account the discount by GLOBAL_MAX_DISCOUNT and calculates the price with the allowed maximum", () => {
    const expected = roundToCents(300 * (1 - 0.5));

    service.registerStrategy({
      key: "Premium",
      strategy: new MockStrategy(0.9),
    });

    const order: Order = { clientType: "Premium", total: 300, itemsCount: 1 };

    const { finalPrice } = service.calculateFinalPrice({ order });

    expect(finalPrice).toBe(expected);
  });

  it("applies composition of a realistic strategy (exercise of combined rules)", () => {
    service.registerStrategy({
      key: "Regular",
      strategy: new CompositeStrategy(),
    });

    const order: Order = {
      clientType: "Regular",
      total: 150,
      itemsCount: 4,
      hasLoyaltyCard: true,
    };

    const { finalPrice } = service.calculateFinalPrice({ order });

    expect(finalPrice).toBe(roundToCents(150 * (1 - 0.1)));
  });

  it("correctly rounds to cents in cases with fractional decimals", () => {
    const expected = roundToCents(19.999 * (1 - 0.12345));

    service.registerStrategy({
      key: "Regular",
      strategy: new MockStrategy(0.12345),
    });

    const order: Order = {
      clientType: "Regular",
      total: 19.999,
      itemsCount: 1,
    };

    const { finalPrice } = service.calculateFinalPrice({ order });

    expect(finalPrice).toBe(expected);
  });
});
