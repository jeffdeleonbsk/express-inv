import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../../common/domainError";
import { LineItemStatus, PurchaseOrderStatus } from "../common/enums";
import { Quantity } from "../common/valueObjects";

export interface IAddToInventoryService {
  addStock(productId: string, warehouseId: string, deliveredQuantity: Quantity): void;
}

export class Delivery {

  public static fromDB(params: {
    lineItemId: string;
    dateDelivered: Date;
    deliveryComment: string;
    deliveredQuantity: Quantity;
  }): Delivery {
    return new Delivery(
      params.lineItemId,
      params.dateDelivered,
      params.deliveryComment,
      params.deliveredQuantity
    );
  }
  constructor(
    public readonly lineItemId: string,
    public readonly dateDelivered: Date,
    public readonly deliveryComment: string,
    public readonly deliveredQuantity: Quantity
  ) {}
}

export class ReceivingLineItem {

  public static fromDB(params: {
    id: string;
    productId: string;
    warehouseId: string;
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
      params.productId,
      params.warehouseId,
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
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public readonly orderedQuantity: Quantity,
    public status: LineItemStatus,
    public deliveredQuantity: Quantity = new Quantity(0, "pcs"),
    public deliveries: Delivery[] = [],
    public dateDelivered?: Date,
    public deliveredComment?: string,
    public dateCancelled?: Date,
    public cancelledComment?: string
  ) {}

  public receive(delivery: Delivery, inventory: IAddToInventoryService): void {
    if (![LineItemStatus.CONFIRMED, LineItemStatus.PARTIALLY_FULFILLED].includes(this.status)) {
      throw new DomainError("Cannot receive delivery in current line item status.");
    }

    this.deliveries.push(delivery);
    this.deliveredQuantity = new Quantity(this.deliveredQuantity.value + delivery.deliveredQuantity.value, this.deliveredQuantity.unit);
    inventory.addStock(this.productId, this.warehouseId, delivery.deliveredQuantity);

    if (this.deliveredQuantity.value >= this.orderedQuantity.value) {
      this.status = LineItemStatus.FULLY_DELIVERED;
      this.dateDelivered = delivery.dateDelivered;
      this.deliveredComment = delivery.deliveryComment;
    } else {
      this.status = LineItemStatus.PARTIALLY_FULFILLED;
    }
  }

  public cancel(date: Date, comment: string): void {
    if (this.status !== LineItemStatus.CONFIRMED) {
      throw new DomainError("Only confirmed line items can be cancelled.");
    }
    this.status = LineItemStatus.LINE_CANCELLED;
    this.dateCancelled = date;
    this.cancelledComment = comment;
  }
}

export class ReceivingPurchaseOrder {

  public static fromDB(params: {
    id: string;
    status: PurchaseOrderStatus;
    lineItems: ReceivingLineItem[];
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
      params.dateDelivered,
      params.deliveredComment,
      params.dateCancelled,
      params.cancelledComment,
      params.dateClosed,
      params.closedComment
    );
  }
  constructor(
    public readonly id: string,
    public status: PurchaseOrderStatus,
    public lineItems: ReceivingLineItem[],
    public dateDelivered?: Date,
    public deliveredComment?: string,
    public dateCancelled?: Date,
    public cancelledComment?: string,
    public dateClosed?: Date,
    public closedComment?: string
  ) {}

  public receiveDelivery(lineItemId: string, delivery: Delivery, inventory: IAddToInventoryService): void {
    if (![PurchaseOrderStatus.CONFIRMED, PurchaseOrderStatus.PARTIALLY_FULFILLED].includes(this.status)) {
      throw new DomainError("Purchase order is not in a receivable state.");
    }
    const item = this.lineItems.find((i) => i.id === lineItemId);
    if (!item) { throw new DomainError("Line item not found"); }

    item.receive(delivery, inventory);

    if (this.lineItems.every((i) => i.status === LineItemStatus.FULLY_DELIVERED)) {
      this.status = PurchaseOrderStatus.FULLY_DELIVERED;
      this.dateDelivered = delivery.dateDelivered;
      this.deliveredComment = delivery.deliveryComment;
    } else {
      this.status = PurchaseOrderStatus.PARTIALLY_FULFILLED;
    }
  }

  public cancelOrder(date: Date, comment: string): void {
    if (this.status !== PurchaseOrderStatus.CONFIRMED) {
      throw new DomainError("Only confirmed orders can be cancelled.");
    }
    if (this.lineItems.some((item) => item.status !== LineItemStatus.CONFIRMED &&
                                    item.status !== LineItemStatus.LINE_CANCELLED)) {
      throw new DomainError("All line items must be confirmed or cancelled to cancel order.");
    }

    this.status = PurchaseOrderStatus.ORDER_CANCELLED;
    this.dateCancelled = date;
    this.cancelledComment = comment;
    this.lineItems.forEach((item) => {
      if (item.status === LineItemStatus.CONFIRMED) { item.cancel(date, comment); }
    });
  }

  public cancelLineItem(lineItemId: string, date: Date, comment: string): void {
    const item = this.lineItems.find((i) => i.id === lineItemId);
    if (!item) { throw new DomainError("Line item not found"); }
    item.cancel(date, comment);

    if (this.lineItems.every((i) => i.status === LineItemStatus.LINE_CANCELLED)) {
      this.status = PurchaseOrderStatus.ORDER_CANCELLED;
      this.dateCancelled = date;
      this.cancelledComment = comment;
    } else if (this.lineItems.every((i) => i.status === LineItemStatus.LINE_CANCELLED ||
                                        i.status === LineItemStatus.FULLY_DELIVERED)) {
      this.status = PurchaseOrderStatus.PARTIALLY_FULFILLED_CLOSED;
      this.dateClosed = date;
      this.closedComment = comment;
    }
  }
}
