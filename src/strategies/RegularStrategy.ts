import type { DiscountStrategy, Order } from "../types";

export class RegularStrategy implements DiscountStrategy {
  private discount: number = 0;

  calculate(order: Order) {
    const { total, itemsCount, hasLoyaltyCard } = order;

    if (total > 100) this.discount += 0.05;

    if (itemsCount > 5) this.discount += 0.02;

    if (hasLoyaltyCard) this.discount += 0.03;

    this.discount = this.discount > 0.5 ? 0.5 : this.discount;

    return total * (1 - this.discount);
  }
}
