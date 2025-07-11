// --- Enums ---
export enum PurchaseOrderStatus {
  DRAFT = "DRAFT",
  DRAFT_CANCELLED = "DRAFT_CANCELLED",
  CONFIRMED = "CONFIRMED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
  FULLY_DELIVERED = "FULLY_DELIVERED",
  PARTIALLY_FULFILLED_CLOSED = "PARTIALLY_FULFILLED_CLOSED",
}
export function stringToPurchaseOrderStatus(str: string):PurchaseOrderStatus | undefined {
  switch(str){
    case "DRAFT": return PurchaseOrderStatus.DRAFT;
    case "DRAFT_CANCELLED": return PurchaseOrderStatus.DRAFT_CANCELLED; 
    case "CONFIRMED": return PurchaseOrderStatus.CONFIRMED; 
    case "ORDER_CANCELLED": return PurchaseOrderStatus.ORDER_CANCELLED; 
    case "PARTIALLY_FULFILLED": return PurchaseOrderStatus.PARTIALLY_FULFILLED; 
    case "FULLY_DELIVERED": return PurchaseOrderStatus.FULLY_DELIVERED; 
    case "PARTIALLY_FULFILLED_CLOSED": return PurchaseOrderStatus.PARTIALLY_FULFILLED_CLOSED;  
  }
  return undefined;
}

export enum LineItemStatus {
  DRAFT = "DRAFT",
  CONFIRMED = "CONFIRMED",
  LINE_CANCELLED = "LINE_CANCELLED",
  PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
  FULLY_DELIVERED = "FULLY_DELIVERED",
}
export function stringToLineItemStatus(str: string):LineItemStatus | undefined {
  switch(str){
    case "DRAFT": return LineItemStatus.DRAFT;
    case "CONFIRMED": return LineItemStatus.CONFIRMED; 
    case "LINE_CANCELLED": return LineItemStatus.LINE_CANCELLED; 
    case "PARTIALLY_FULFILLED": return LineItemStatus.PARTIALLY_FULFILLED; 
    case "FULLY_DELIVERED": return LineItemStatus.FULLY_DELIVERED; 
  }
  return undefined;
}
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}
export function stringToUserStatus(str: string):UserStatus  {
  switch(str){
    case "ACTIVE": return UserStatus.ACTIVE;
    case "INACTIVE": return UserStatus.INACTIVE; 
  }
  return UserStatus.INACTIVE;
}