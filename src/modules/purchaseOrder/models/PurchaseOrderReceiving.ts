
import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../../common/domainError";
import { MutableObject } from "../../common/mutableObject";
import { Product, Warehouse } from "../../domain/common/commonEntities";
import { LineItemStatus, PurchaseOrderStatus } from "../../domain/common/enums";
import { Quantity } from "../../domain/common/genericValueObjects";
import { ILineItemParent } from "./iLineItemParent";

export interface IAddToInventoryService {
    addStock(productId: string, warehouseId: string, deliveredQuantity: Quantity): void;
}

export class Delivery extends MutableObject {
    public static fromDB(params: {
        id: string;
        lineItemId: string;
        dateDelivered: Date;
        deliveryComment: string;
        deliveredQuantity: Quantity;
    }): Delivery {
        return new Delivery(
            params.id,
            params.lineItemId,
            params.dateDelivered,
            params.deliveryComment,
            params.deliveredQuantity
        );
    }
    public static createNew(
        lineItemId: string,
        dateDelivered: Date,
        deliveryComment: string,
        deliveredQuantity: Quantity
    ) {
        if (deliveredQuantity.value <= 0) {
            throw new DomainError("Delivered quantity must be greater than zero.");
        }
        const delivery = new Delivery(
            "DELIVER-" + uuidv4(),
            lineItemId,
            dateDelivered,
            deliveryComment,
            deliveredQuantity
        );
        delivery.isNew = true;
        return delivery;
    }
    private constructor(
        public readonly id: string,
        public readonly lineItemId: string,
        public readonly dateDelivered: Date,
        public readonly deliveryComment: string,
        public readonly deliveredQuantity: Quantity
    ) {
        super();
    }
}

export class ReceivingLineItem extends MutableObject {
    public static fromDB(params: {
        id: string;
        product: Product;
        warehouse: Warehouse;
        orderedQuantity: Quantity;
        status: LineItemStatus;
        deliveredQuantity?: Quantity;
        deliveries?: Delivery[];
        dateDelivered?: Date;
        deliveredComment?: string;
        dateCancelled?: Date;
        cancelledComment?: string;
    }): ReceivingLineItem {
        return new ReceivingLineItem(
            params.id,
            params.product,
            params.warehouse,
            params.orderedQuantity,
            params.status,
            params.deliveredQuantity ?? new Quantity(0, "pcs"),
            params.deliveries ?? [],
            params.dateDelivered,
            params.deliveredComment,
            params.dateCancelled,
            params.cancelledComment
        );
    }
    public get status(): LineItemStatus {
        return this._status;
    }
    public get deliveredQuantity(): Quantity {
        return this._deliveredQuantity;
    }
    public get deliveries(): Delivery[] {
        return this._deliveries;
    }
    public get dateDelivered(): Date | undefined {
        return this._dateDelivered;
    }
    public get deliveredComment(): string {
        return this._deliveredComment || "";
    }
    public get dateCancelled(): Date | undefined {
        return this._dateCancelled;
    }
    public get cancelledComment(): string {
        return this._cancelledComment || "";
    }

    private _status: LineItemStatus;
    private _deliveredQuantity: Quantity = new Quantity(0, "pcs");
    private _deliveries: Delivery[] = [];
    private _dateDelivered?: Date;
    private _deliveredComment?: string;
    private _dateCancelled?: Date;
    private _cancelledComment?: string;
    private constructor(
        public readonly id: string,
        public readonly product: Product,
        public readonly warehouse: Warehouse,
        public readonly orderedQuantity: Quantity,
        status: LineItemStatus,
        deliveredQuantity: Quantity = new Quantity(0, "pcs"),
        deliveries: Delivery[] = [],
        dateDelivered?: Date,
        deliveredComment?: string,
        dateCancelled?: Date,
        cancelledComment?: string
    ) {
        super();
        this._status = status;
        this._deliveredQuantity = deliveredQuantity;
        this._deliveries = deliveries;
        this._dateDelivered = dateDelivered;
        this._deliveredComment = deliveredComment;
        this._dateCancelled = dateCancelled;
        this._cancelledComment = cancelledComment;
    }

    public receive(parent: ILineItemParent, delivery: Delivery, inventory: IAddToInventoryService): void {
        if (parent === null || parent === undefined) {
            throw new DomainError("Line items can only be cancelled thru parent PO.");
        }
        if (parent.ownsLineItem(this.id) === false) {
            throw new DomainError("Line items can only be cancelled thru parent PO.");
        }
        if (![LineItemStatus.CONFIRMED, LineItemStatus.PARTIALLY_FULFILLED].includes(this._status)) {
            throw new DomainError("Cannot receive delivery in current line item status.");
        }

        this._deliveries.push(delivery);
        this._deliveredQuantity = new Quantity(this._deliveredQuantity.value + delivery.deliveredQuantity.value, this._deliveredQuantity.unit);
        inventory.addStock(this.product.id, this.warehouse.id, delivery.deliveredQuantity);

        if (this._deliveredQuantity.value >= this.orderedQuantity.value) {
            this._status = LineItemStatus.FULLY_DELIVERED;
            this._dateDelivered = delivery.dateDelivered;
            this._deliveredComment = delivery.deliveryComment;
        } else {
            this._status = LineItemStatus.PARTIALLY_FULFILLED;
        }
        this.isDirty = true;
    }

    public cancel(parent: ILineItemParent, date: Date, comment: string): void {
        if (parent === null || parent === undefined) {
            throw new DomainError("Line items can only be cancelled thru parent PO.");
        }
        if (parent.ownsLineItem(this.id) === false) {
            throw new DomainError("Line items can only be cancelled thru parent PO.");
        }
        if (this._status !== LineItemStatus.CONFIRMED) {
            throw new DomainError("Only confirmed line items can be cancelled.");
        }
        this._status = LineItemStatus.LINE_CANCELLED;
        this._dateCancelled = date;
        this._cancelledComment = comment;
        this.isDirty = true;
    }
}

export class ReceivingPurchaseOrder extends MutableObject implements ILineItemParent {
    public static fromDB(params: {
        id: string;
        status: PurchaseOrderStatus;
        lineItems: ReceivingLineItem[];
        dateConfirmed?: Date;
        dateDelivered?: Date;
        deliveredComment?: string;
        dateCancelled?: Date;
        cancelledComment?: string;
        dateClosed?: Date;
        closedComment?: string;
    }): ReceivingPurchaseOrder {
        return new ReceivingPurchaseOrder(
            params.id,
            params.status,
            params.lineItems,
            params.dateConfirmed,
            params.dateDelivered,
            params.deliveredComment,
            params.dateCancelled,
            params.cancelledComment,
            params.dateClosed,
            params.closedComment
        );
    }
    public get status(): PurchaseOrderStatus {
        return this._status;
    }
    public get lineItems(): ReceivingLineItem[] {
        return this._lineItems;
    }
    public get dateConfirmed(): Date | undefined {
        return this._dateConfirmed;
    }
    public get dateDelivered(): Date | undefined {
        return this._dateDelivered;
    }
    public get deliveredComment(): string | undefined {
        return this._deliveredComment;
    }
    public get dateCancelled(): Date | undefined {
        return this._dateCancelled;
    }
    public get cancelledComment(): string | undefined {
        return this._cancelledComment;
    }
    public get dateClosed(): Date | undefined {
        return this._dateClosed;
    }
    public get closedComment(): string | undefined {
        return this._closedComment;
    }

    private _status: PurchaseOrderStatus;
    private _lineItems: ReceivingLineItem[];
    private _dateConfirmed?: Date;
    private _dateDelivered?: Date;
    private _deliveredComment?: string;
    private _dateCancelled?: Date;
    private _cancelledComment?: string;
    private _dateClosed?: Date;
    private _closedComment?: string;
    private constructor(
        public readonly id: string,
        status: PurchaseOrderStatus,
        lineItems: ReceivingLineItem[],
        dateConfirmed?: Date,
        dateDelivered?: Date,
        deliveredComment?: string,
        dateCancelled?: Date,
        cancelledComment?: string,
        dateClosed?: Date,
        closedComment?: string
    ) {
        super();
        this._status = status;
        this._lineItems = lineItems;
        this._dateConfirmed = dateConfirmed;
        this._dateDelivered = dateDelivered;
        this._deliveredComment = deliveredComment;
        this._dateCancelled = dateCancelled;
        this._cancelledComment = cancelledComment;
        this._dateClosed = dateClosed;
        this._closedComment = closedComment;
    }

    public receiveDelivery(lineItemId: string, delivery: Delivery, inventory: IAddToInventoryService): void {
        if (![PurchaseOrderStatus.CONFIRMED, PurchaseOrderStatus.PARTIALLY_FULFILLED].includes(this._status)) {
            throw new DomainError("Purchase order is not in a receivable state.");
        }
        if (delivery.dateDelivered < this._dateConfirmed!) {
            throw new DomainError("Delivery date cannot be earlier than confirmation date.");
        }
        const item = this._lineItems.find((i) => i.id === lineItemId);
        if (!item) { throw new DomainError("Line item not found"); }

        item.receive(this, delivery, inventory);

        if (this._lineItems.every((i) => i.status === LineItemStatus.FULLY_DELIVERED)) {
            this._status = PurchaseOrderStatus.FULLY_DELIVERED;
            this._dateDelivered = delivery.dateDelivered;
            this._deliveredComment = delivery.deliveryComment;
        } else {
            this._status = PurchaseOrderStatus.PARTIALLY_FULFILLED;
        }
        this.isDirty = true;
    }

    public cancelOrder(date: Date, comment: string): void {
        if (this._status !== PurchaseOrderStatus.CONFIRMED) {
            throw new DomainError("Only confirmed orders can be cancelled.");
        }
        if (this._lineItems.some((item) => item.status !== LineItemStatus.CONFIRMED &&
            item.status !== LineItemStatus.LINE_CANCELLED)) {
            throw new DomainError("All line items must be confirmed or cancelled to cancel order.");
        }

        this._status = PurchaseOrderStatus.ORDER_CANCELLED;
        this._dateCancelled = date;
        this._cancelledComment = comment;
        this.isDirty = true;
        this._lineItems.forEach((item) => {
            if (item.status === LineItemStatus.CONFIRMED) {
                item.cancel(this, date, comment);
            }
        });
    }
    public closeOrder(date: Date, comment: string): void {
        if (![PurchaseOrderStatus.CONFIRMED, PurchaseOrderStatus.PARTIALLY_FULFILLED].includes(this._status)) {
            throw new DomainError("Purchase order is not in a closable state.");
        }
        const hasDeliveredItems = this._lineItems.some(
          (item) => item.status === LineItemStatus.FULLY_DELIVERED || item.status === LineItemStatus.PARTIALLY_FULFILLED);

        if (hasDeliveredItems === false) {
          this.cancelOrder(date, comment);
          return;
        }

        this._status = PurchaseOrderStatus.PARTIALLY_FULFILLED_CLOSED;
        this._dateClosed = date;
        this._closedComment = comment;
        this.isDirty = true;
        this._lineItems.forEach((item) => {
            if (item.status === LineItemStatus.CONFIRMED) {
                item.cancel(this, date, comment);
            }
        });
    }

    public cancelLineItem(lineItemId: string, date: Date, comment: string): void {
        const item = this._lineItems.find((i) => i.id === lineItemId);
        if (!item) { throw new DomainError("Line item not found"); }
        item.cancel(this, date, comment);

        if (this._lineItems.every((i) => i.status === LineItemStatus.LINE_CANCELLED)) {
            this._status = PurchaseOrderStatus.ORDER_CANCELLED;
            this._dateCancelled = date;
            this._cancelledComment = comment;
        } else if (this._lineItems.every((i) => i.status === LineItemStatus.LINE_CANCELLED ||
            i.status === LineItemStatus.FULLY_DELIVERED)) {
            this._status = PurchaseOrderStatus.PARTIALLY_FULFILLED_CLOSED;
            this._dateClosed = date;
            this._closedComment = comment;
        }
        this.isDirty = true;
    }

    public ownsLineItem(id: string): boolean {
        return this._lineItems.findIndex((item) => item.id === id) >= 0;
    }
}
