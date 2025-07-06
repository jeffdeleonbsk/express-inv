import { DomainError } from "../../common/domainError";
import { Result } from "../../common/result";
import { LineItem } from "./lineItem";
import { Vendor } from "./vendor";

export enum OrderStatus {
  Draft                     = "DRAFT",
  DraftCancelled            = "DRAFT_CANCELLED",
  Ordered                   = "ORDERED",
  OrderCancelled            = "ORDER_CANCELLED",
  PartiallyFulfilled        = "PARTIALLY_FULFILLED",
  PartiallyFulfilledClosed  = "PARTIALLY_FULFILLED_CLOSED",
  FullyDelivered            = "FULLY_DELIVERED"
}
// Aggregate
export class PurchaseOrder {
    public get orderStatusCode(): OrderStatus {
        return this._orderStatusCode;
    }
    public get lineItems(): LineItem[] {
        return this._lineItems;
    }
    public static createNew(_id: number, _vendor: Vendor, createdAt: Date, comment: string): PurchaseOrder {
        _vendor.checkValidityForPO();
        return new PurchaseOrder(_id, _vendor,  null, createdAt, comment);
    }
    private _lineItems: LineItem[] = [];
    private _orderStatusCode = OrderStatus.Draft;
    public constructor(
        private _id: number,
        private _vendor: Vendor,
        lineItemList: LineItem[] | null,
        private _createdAt: Date,
        private _createdComment: string,

        private _orderedAt?: Date|null,
        private _deliveredAt?: Date|null,
        private _cancelledAt?: Date|null,
        private _closedAt?: Date|null,
        private _orderedComment?: string|null,
        private _deliveredComment?: string|null,
        private _cancelledComment?: string|null,
        private _closedComment?: string|null,
    ) {
        this._orderStatusCode = OrderStatus.Draft;
        lineItemList?.forEach((item) => {
            this._lineItems.push();
        });
    }
    public addLineItem(item: LineItem): void {
        if (this.canAddLineItem() === false) {
            throw new DomainError("Can only add on drafted orders");
        }
        const idx = this._lineItems.findIndex((lineItem) => {
            return item.product.id === lineItem.product.id && item.warehouse.code === lineItem.warehouse.code;
        });
        if (idx < 0) {
            this._lineItems.push(item);
        }
        this._lineItems[idx] = item;
    }
    public removeLineItem(item: LineItem): void {
        if (this.canAddLineItem() === false) {
            throw new DomainError("Can only remove line items on drafted orders");
        }
        const idx = this._lineItems.findIndex((lineItem) => {
            return item.product.id === lineItem.product.id && item.warehouse.code === lineItem.warehouse.code;
        });
        if (idx < 0) {
            throw new DomainError("Did not find line item in order");
        }
        this._lineItems.splice(idx, 1);
    }

    public canBeSetOrdered(): boolean {
        return this._orderStatusCode === OrderStatus.Draft && this._lineItems.length > 0;
    }
    public canBeDraftCancelled(): boolean {
        return this._orderStatusCode === OrderStatus.Draft;
    }
    public setOrdered(orderedAt: Date, comment: string): void {
        if (this.canBeSetOrdered() === false) {
            throw new DomainError("You can only order PO's that are draft and has at least one line item.");
        }
        this._lineItems.forEach((item) => {
            item.setOrdered(orderedAt, comment);
        });
        this._orderStatusCode = OrderStatus.Ordered;
        this._orderedAt = orderedAt;
        this._orderedComment = comment;
    }
    private canAddLineItem(): boolean {
        return this._orderStatusCode === OrderStatus.Draft;
    }

}
