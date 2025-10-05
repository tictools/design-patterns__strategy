import { Order } from "./types";

export function calculateFinalPrice(order: Order): number {
  const { clientType, total, itemsCount, hasLoyaltyCard } = order;

  let discount = 0;

  // Scattered and coupled rules: many if/switch
  if (clientType === "Regular") {
    if (total > 100) discount += 0.05; // 5% if purchase > 100
    if (itemsCount > 5) discount += 0.02; // +2% for many items
    if (hasLoyaltyCard) discount += 0.03;
  } else if (clientType === "Premium") {
    discount += 0.1; // 10% base
    if (total > 200) discount += 0.05;
    // special rule for Premium and cards
    if (hasLoyaltyCard) discount += 0.02;
  } else if (clientType === "VIP") {
    discount += 0.2; // 20% base
    if (itemsCount > 10) discount += 0.05;
    // extra condition depending on total and card — complicated logic
    if (total > 500 && hasLoyaltyCard) discount += 0.1;
  } else {
    // unsafe fallback
    discount += 0;
  }

  // Discount application logic with limits
  if (discount > 0.5) discount = 0.5; // no more than 50%

  const finalPrice = total * (1 - discount);
  return Math.round(finalPrice * 100) / 100;
}
