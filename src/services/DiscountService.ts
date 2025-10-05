import type { ClientType, DiscountStrategy, Nullable, Order } from "../types";

interface IDiscountService {
  registerStrategy: ({
    key,
    strategy,
  }: {
    key: ClientType;
    strategy: DiscountStrategy;
  }) => void;

  unregisterStrategy: ({ key }: { key: string }) => void;
  unregisterAllStrategies: () => void;

  calculateFinalPrice: ({ order }: { order: Order }) => { finalPrice: number };
}

export class DiscountService implements IDiscountService {
  private strategies: Map<string, DiscountStrategy> = new Map();
  private GLOBAL_MAX_DISCOUNT: number = 0.5;

  registerStrategy({
    key,
    strategy,
  }: {
    key: ClientType;
    strategy: DiscountStrategy;
  }) {
    if (!key || !strategy) throw new Error("Invalid strategy registration");

    this.strategies.set(key, strategy);
  }

  unregisterStrategy({ key }: { key: string }) {
    this.strategies.delete(key);
  }

  unregisterAllStrategies() {
    this.strategies.clear();
  }

  calculateFinalPrice({ order }: { order: Order }) {
    if (!order) throw new Error("Order required");

    const strategy = this.resolveStrategyFor(order);
    let discount = 0;

    if (strategy) {
      const percentage = strategy.calculate(order);
      discount += percentage;
    }

    // If discount exceeds the allowed maximum, apply the cap to the discount
    const appliedDiscount = this.isExceedingRange(discount)
      ? this.GLOBAL_MAX_DISCOUNT
      : discount;

    const finalPrice = this.roundToCents(order.total * (1 - appliedDiscount));

    return { finalPrice };
  }

  private resolveStrategyFor(order: Order): Nullable<DiscountStrategy> {
    return this.strategies.get(order.clientType) || null;
  }

  private isExceedingRange(discount: number): boolean {
    return discount > this.GLOBAL_MAX_DISCOUNT;
  }

  private roundToCents(amount: number) {
    return Math.round(amount * 100) / 100;
  }
}
