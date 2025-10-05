import type { DiscountStrategy, Order } from "../types";

export class RegularStrategy implements DiscountStrategy {
  calculate(order: Order) {
    let percentage: number = 0;

    if (order.total > 100) percentage += 0.05;
    if (order.itemsCount > 5) percentage += 0.02;
    if (order.hasLoyaltyCard) percentage += 0.03;

    return percentage;
  }
}
