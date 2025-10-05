import type { DiscountStrategy, Order } from "../types";

export class PremiumStrategy implements DiscountStrategy {
  calculate(order: Order) {
    let percentage: number = 0.1;

    if (order.total > 200) percentage += 0.05;
    if (order.hasLoyaltyCard) percentage += 0.02;

    return percentage;
  }
}
