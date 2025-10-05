import type { DiscountStrategy, Order } from "../types";

export class VipStrategy implements DiscountStrategy {
  private discount: number = 0.2;

  calculate(order: Order) {
    const { total, itemsCount, hasLoyaltyCard } = order;

    if (itemsCount > 10) this.discount += 0.05;

    if (total > 500 && hasLoyaltyCard) this.discount += 0.1;

    this.discount = this.discount > 0.5 ? 0.5 : this.discount;

    return total * (1 - this.discount);
  }
}
