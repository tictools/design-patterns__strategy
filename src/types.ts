export type ClientType = "Regular" | "Premium" | "VIP";

export interface Order {
  clientType: ClientType;
  total: number;
  itemsCount: number;
  hasLoyaltyCard?: boolean;
}

export interface DiscountStrategy<> {
  calculate(order: Order): number;
}

export type Nullable<T> = T | null;
