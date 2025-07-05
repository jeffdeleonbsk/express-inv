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
export class PurchaseOrder{
    private _lineItems : LineItem[] = [];
    private _orderStatusCode = OrderStatus.Draft;
    constructor(
        private _id: number,
        private _vendor: Vendor,
        lineItemList: LineItem[] | null        
    ){
        this._orderStatusCode = OrderStatus.Draft;
        lineItemList?.forEach((item) => {
            this.addLineItemNoCheck(item);
        });
    }

    private addLineItemNoCheck(item: LineItem) : void {
        // no check for status yet.
        this._lineItems.push();
    }
    private canAddLineItem() : boolean {
        return this._orderStatusCode === OrderStatus.Draft;
    }
    public addLineItem(item: LineItem) : void {
        if (this.canAddLineItem() == false)
            throw new DomainError("Can only add on drafted orders");
        const idx = this._lineItems.findIndex(lineItem => {
            return item.product.id === lineItem.product.id; 
        });        
        if (idx < 0)
            this._lineItems.push();

        this._lineItems[idx] = item;
    }
    public removeLineItem(item: LineItem) : void {
        if (this.canAddLineItem() == false)
            throw new DomainError("Can only remove line items on drafted orders");
        
        const idx = this._lineItems.findIndex(lineItem => {
            return item.product.id === lineItem.product.id; 
        });
        
        if (idx < 0)
            throw new DomainError("Did not find line item in order");

        this._lineItems.splice(idx, 1);
    }


}