import { DomainError } from "../../common/domainError";
import { Product } from "./product";
import { OrderStatus } from "./purchaseOrder";
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
    public get product(): Product {
        return this._product;
    }
    public get warehouse(): Warehouse {
        return this._warehouse;
    }
    public get orderedQuantity(): number {
        return this._orderedQuantity;
    }
    public get deliveredQuantity(): number | null {
        return this._deliveredQuantity;
    }
    public get unitPrice(): number {
        return this._unitPrice;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }
    public get orderedAt(): Date|null {
        return this._orderedAt;
    }
    public get deliveredAt(): Date|null {
        return this._deliveredAt;
    }
    public get cancelledAt(): Date|null {
        return this._cancelledAt;
    }
    public get closedAt(): Date|null {
        return this._closedAt;
    }

    public get createdComment(): string {
        return this._createdComment;
    }
    public get orderedComment(): string|null {
        return this._orderedComment;
    }
    public get deliveredComment(): string|null {
        return this._deliveredComment;
    }
    public get cancelledComment(): string|null {
        return this._cancelledComment;
    }
    public get closedComment(): string|null {
        return this._closedComment;
    }
    public get lineStatusCode(): LineItemStatus {
        return this._lineStatusCode;
    }

    public static createNew(
        id: number,
        product: Product,
        warehouse: Warehouse ,
        orderedQuantity: number,
        unitPrice: number
    ): LineItem {
        if (product.needsRefrigeration) {
            if (warehouse.isRefrigerated === false) {
                throw new DomainError(
                    "Products that require refrigeration must be assigned to refrigerated storage"
                );
            }
        }
        if (warehouse.isRefrigerated) {
            if (product.needsRefrigeration) {
                throw new DomainError(
                    "Product must be assigned to unrefrigerated storage."
                );
            }
        }
        const dt = new Date();
        return new LineItem(id, product, warehouse, orderedQuantity, null, unitPrice, null, dt,
            null, null, null, null, "", null, null, null, null);
    }
    private _lineStatusCode = LineItemStatus.Draft;
    public constructor(
        private _id: number,
        private _product: Product,
        private _warehouse: Warehouse ,
        private _orderedQuantity: number,
        private _deliveredQuantity: number | null,
        private _unitPrice: number,
        statusCode: LineItemStatus | null,
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

    ) {
        if (statusCode) {
            this._lineStatusCode = statusCode;
        }
    }

    public setOrdered(orderedAt: Date, comment: string): void {
        this._lineStatusCode = LineItemStatus.Ordered;
        this._orderedAt = orderedAt;
        this._orderedComment = comment;
    }

}
