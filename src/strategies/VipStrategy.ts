import type { DiscountStrategy, Order } from "../types";

export class VipStrategy implements DiscountStrategy {
  calculate(order: Order) {
    let percentage: number = 0.2;

    if (order.itemsCount > 10) percentage += 0.05;
    if (order.total > 500 && order.hasLoyaltyCard) percentage += 0.1;

    return percentage;
  }
}
