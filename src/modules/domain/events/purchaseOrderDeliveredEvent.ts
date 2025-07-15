import { Quantity } from "../common/genericValueObjects";

export class PurchaseOrderDeliveredEvent {
    public constructor(
        public readonly productId: string,
        public readonly warehouseId: string,
        public readonly deliveredQuantity: Quantity
    ) {}
}
