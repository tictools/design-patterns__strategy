import type { DiscountStrategy, Order } from "../types";

export class PremiumStrategy implements DiscountStrategy {
  private discount: number = 0.1;

  calculate(order: Order) {
    const { total, hasLoyaltyCard } = order;

    if (total > 200) this.discount += 0.05;

    if (hasLoyaltyCard) this.discount += 0.02;

    this.discount = this.discount > 0.5 ? 0.5 : this.discount;

    return total * (1 - this.discount);
  }
}
