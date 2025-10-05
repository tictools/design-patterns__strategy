import { PremiumStrategy } from "./strategies/PremiumStrategy";
import { RegularStrategy } from "./strategies/RegularStrategy";
import { VipStrategy } from "./strategies/VIPStrategy";
import type { Order } from "./types";

export function calculateFinalPrice(order: Order): number {
  const { clientType, total } = order;

  if (clientType === "Regular") {
    const finalPrice = new RegularStrategy().calculate(order);

    return Math.round(finalPrice * 100) / 100;
  }

  if (clientType === "Premium") {
    const finalPrice = new PremiumStrategy().calculate(order);

    return Math.round(finalPrice * 100) / 100;
  }

  if (clientType === "VIP") {
    const finalPrice = new VipStrategy().calculate(order);

    return Math.round(finalPrice * 100) / 100;
  }

  return total;
}
