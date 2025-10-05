export type ClientType = "Regular" | "Premium" | "VIP";

export interface Order {
  clientType: ClientType;
  total: number;
  itemsCount: number;
  hasLoyaltyCard?: boolean;
}
