import { Product } from "./product";
import { Warehouse } from "./warehouse";

export  enum LineItemStatus {
    Draft                     = "DRAFT",
    DraftCancelled            = "DRAFT_CANCELLED",
    Ordered                   = "ORDERED",
    OrderCancelled            = "ORDER_CANCELLED",
    PartiallyFulfilled        = "PARTIALLY_FULFILLED",
    PartiallyFulfilledClosed  = "PARTIALLY_FULFILLED_CLOSED",
    FullyDelivered            = "FULLY_DELIVERED" 
}
export class LineItem {
    private _lineStatusCode = LineItemStatus.Draft;
    public constructor(
        private _id: number,
        private _product: Product,
        private _warehouse: Warehouse | null,
        private _orderedQuantity: number,
        private _deliveredQuantity: number | null,
        private _unitPrice: number,
        statusCode: LineItemStatus,
        private _createdAt: Date,
        private _orderedAt: Date|null,
        private _deliveredAt: Date|null,
        private _cancelledAt: Date|null,
        private _closedAt: Date|null,
        
        private _createdComment: string,
        private _orderedComment: string|null,
        private _deliveredComment: string|null,
        private _cancelledComment: string|null,
        private _closedComment: string|null,
        
    ){} 
    public get product() : Product {
        return this._product;
    }
}