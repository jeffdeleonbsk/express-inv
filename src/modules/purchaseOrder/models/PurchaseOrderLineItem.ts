import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../../common/domainError";
import { MutableObject } from "../../common/mutableObject";
import { Product, Warehouse } from "../../domain/common/domainValueObjects";
import { LineItemStatus } from "../../domain/common/enums";
import { Money, Quantity } from "../../domain/common/genericValueObjects";
import { ILineItemParent } from "./iLineItemParent";

export class PurchaseOrderLineItem extends MutableObject  {
  // --- Getters ---
  get warehouse(): Warehouse {
    return this._warehouse;
  }
  get orderedQuantity(): Quantity {
    return this._orderedQuantity;
  }
  get unitPrice(): Money {
    return this._unitPrice;
  }
  get status(): LineItemStatus {
    return this._status;
  }
  get confirmComment(): string | undefined {
    return this._confirmComment;
  }
  get cancelComment(): string | undefined {
    return this._cancelComment;
  }
  get dateConfirmed(): Date | undefined {
    return this._dateConfirmed;
  }
  get dateCancelled(): Date | undefined {
    return this._dateCancelled;
  }
  public static fromDB(params: {
    id: string;
    product: Product;
    warehouse: Warehouse;
    orderedQuantity: Quantity;
    unitPrice: Money;
    status: LineItemStatus;
    confirmComment?: string;
    cancelComment?: string;
    dateConfirmed?: Date;
    dateCancelled?: Date;
  }): PurchaseOrderLineItem {
    const item = new PurchaseOrderLineItem(
      params.id,
      params.product,
      params.warehouse,
      params.orderedQuantity,
      params.unitPrice
    );
    item._status = params.status;
    item._confirmComment = params.confirmComment;
    item._cancelComment = params.cancelComment;
    item._dateConfirmed = params.dateConfirmed;
    item._dateCancelled = params.dateCancelled;
    return item;
  }
  public static createNew(
    product: Product|null,
    warehouse: Warehouse|null,
    orderedQuantity: Quantity,
    unitPrice: Money
  ): PurchaseOrderLineItem {
    if (product === null || product === undefined) {
      throw new DomainError("Product must be provided.");
    }
    if (warehouse === null || warehouse === undefined) {
      throw new DomainError("Warehouse must be provided.");
    }
    if (!product.isActive) { throw new DomainError("Product must be active."); }
    if (!warehouse.isActive) { throw new DomainError("Warehouse must be active."); }
    if (product.needRefrigeration !== warehouse.isRefrigerated) {
      throw new DomainError("Product refrigeration requirement does not match warehouse capability.");
    }
    const id = uuidv4();
    const ret = new PurchaseOrderLineItem(id, product, warehouse, orderedQuantity, unitPrice);
    ret.isNew = true;
    return ret;
}
  public readonly id: string;
  public readonly product: Product;
  private _warehouse: Warehouse;
  private _orderedQuantity: Quantity;
  private _unitPrice: Money;
  private _status: LineItemStatus = LineItemStatus.DRAFT;
  private _confirmComment?: string;
  private _cancelComment?: string;
  private _dateConfirmed?: Date;
  private _dateCancelled?: Date;
  private constructor(
    id: string,
    product: Product,
    warehouse: Warehouse,
    orderedQuantity: Quantity,
    unitPrice: Money
  ) {
    super();
    this.product = product;
    this._warehouse = warehouse;
    this._orderedQuantity = orderedQuantity;
    this._unitPrice = unitPrice;
    this.id = id;
  }
  // --- Mutations ---
  public updateWarehouse(warehouse: Warehouse) {
    if (!warehouse.isActive) { throw new DomainError("Warehouse must be active."); }
    if (this._status !== LineItemStatus.DRAFT) {
      throw new DomainError("Can only update warehouse in DRAFT status.");
    }
    if (this.product.needRefrigeration !== warehouse.isRefrigerated) {
      throw new DomainError("Warehouse refrigeration does not match product requirement.");
    }
    this._warehouse = warehouse;
  }
  public updateOrderedQuantity(orderedQuantity: Quantity) {
    if (this._status !== LineItemStatus.DRAFT) {
      throw new DomainError("Can only update quantity in DRAFT status.");
    }
    this._orderedQuantity = orderedQuantity;
  }
  public updateUnitPrice(unitPrice: Money) {
    if (this._status !== LineItemStatus.DRAFT) {
      throw new DomainError("Can only update unit price in DRAFT status.");
    }
    this._unitPrice = unitPrice;
  }
  public cancel(po: ILineItemParent, date: Date, comment: string) {
    if (po === null || po === undefined) {
        throw new DomainError("Line items can only be cancelled thru PO.");
    }
    if (po.ownsLineItem(this.id) === false) {
        throw new DomainError("Line items can only be confirmed thru parent PO.");
    }
    this._status = LineItemStatus.LINE_CANCELLED;
    this._cancelComment = comment;
    this._dateCancelled = date;
    this.isDirty = true;
  }
  public confirm(po: ILineItemParent, date: Date, comment: string) {
    if (po === null || po === undefined) {
        throw new DomainError("Line items can only be confirmed thru PO.");
    }
    if (po.ownsLineItem(this.id) === false) {
        throw new DomainError("Line items can only be confirmed thru parent PO.");
    }
    this._status = LineItemStatus.CONFIRMED;
    this._confirmComment = comment;
    this._dateConfirmed = date;
    this.isDirty = true;
  }
}
