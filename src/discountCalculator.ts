import { DiscountService } from "./services/DiscountService";
import { PremiumStrategy } from "./strategies/PremiumStrategy";
import { RegularStrategy } from "./strategies/RegularStrategy";
import { VipStrategy } from "./strategies/VipStrategy";
import type { Order } from "./types";

//create service
const discountService = new DiscountService();

//register strategies
discountService.registerStrategy({
  key: "Regular",
  strategy: new RegularStrategy(),
});
discountService.registerStrategy({
  key: "Premium",
  strategy: new PremiumStrategy(),
});
discountService.registerStrategy({ key: "VIP", strategy: new VipStrategy() });

export function calculateFinalPrice(
  order: Order,
  discountService: DiscountService
): number {
  const { finalPrice } = discountService.calculateFinalPrice({ order });

  return finalPrice;
}
