import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../../common/domainError";
import { LineItemStatus, PurchaseOrderStatus } from "../common/enums";

// --- Value Objects / Entities ---

export class Vendor {
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly name: string,
    public readonly isActive: boolean
  ) {}
}

export class Warehouse {
  constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly isRefrigerated: boolean
  ) {}
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly needRefrigeration: boolean
  ) {}
}

export interface ILineItemParent {
    ownsLineItem(id: string): boolean;
}
// --- Line Item ---

export class PurchaseOrderLineItem {
  // --- Getters ---
  get warehouse(): Warehouse {
    return this._warehouse;
  }

  get orderedQuantity(): number {
    return this._orderedQuantity;
  }

  get unitPrice(): number {
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
    orderedQuantity: number;
    unitPrice: number;
    status: LineItemStatus;
    confirmComment?: string;
    cancelComment?: string;
    dateConfirmed?: Date;
    dateCancelled?: Date;
  }): PurchaseOrderLineItem {
    const item = new PurchaseOrderLineItem(
      params.product,
      params.warehouse,
      params.orderedQuantity,
      params.unitPrice,
      params.id
    );

    item._status = params.status;
    item._confirmComment = params.confirmComment;
    item._cancelComment = params.cancelComment;
    item._dateConfirmed = params.dateConfirmed;
    item._dateCancelled = params.dateCancelled;

    return item;
  }
  public readonly id: string;
  public readonly product: Product;
  private _warehouse: Warehouse;
  private _orderedQuantity: number;
  private _unitPrice: number;
  private _status: LineItemStatus = LineItemStatus.DRAFT;
  private _confirmComment?: string;
  private _cancelComment?: string;
  private _dateConfirmed?: Date;
  private _dateCancelled?: Date;

  constructor(
    product: Product,
    warehouse: Warehouse,
    orderedQuantity: number,
    unitPrice: number,
    id?: string
  ) {
    if (!product.isActive) { throw new DomainError("Product must be active."); }
    if (!warehouse.isActive) { throw new DomainError("Warehouse must be active."); }
    if (product.needRefrigeration !== warehouse.isRefrigerated) {
      throw new DomainError("Product refrigeration requirement does not match warehouse capability.");
    }

    this.product = product;
    this._warehouse = warehouse;
    this._orderedQuantity = orderedQuantity;
    this._unitPrice = unitPrice;
    this.id = id ?? uuidv4();
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

  public updateOrderedQuantity(orderedQuantity: number) {
    if (this._status !== LineItemStatus.DRAFT) {
      throw new DomainError("Can only update quantity in DRAFT status.");
    }
    this._orderedQuantity = orderedQuantity;
  }

  public updateUnitPrice(unitPrice: number) {
    if (this._status !== LineItemStatus.DRAFT) {
      throw new DomainError("Can only update unit price in DRAFT status.");
    }
    this._unitPrice = unitPrice;
  }

  // simulate friend class, not 100% but mke it hard to access it from other than the parent
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
  }
  // simulate friend class, not 100% but mke it hard to access it from other than the parent
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
  }
}

// --- Purchase Order ---

export class PurchaseOrder implements ILineItemParent {
  // --- Getters ---
  get status(): PurchaseOrderStatus {
    return this._status;
  }

  get lineItems(): PurchaseOrderLineItem[] {
    return this._lineItems;
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
    vendor: Vendor;
    date: Date;
    comment?: string;
    status: PurchaseOrderStatus;
    lineItems: PurchaseOrderLineItem[];
    confirmComment?: string;
    cancelComment?: string;
    dateConfirmed?: Date;
    dateCancelled?: Date;
  }): PurchaseOrder {
    const po = new PurchaseOrder(
      params.vendor,
      params.date,
      params.comment,
      params.id
    );

    po._status = params.status;
    po._lineItems = params.lineItems;
    po._confirmComment = params.confirmComment;
    po._cancelComment = params.cancelComment;
    po._dateConfirmed = params.dateConfirmed;
    po._dateCancelled = params.dateCancelled;

    return po;
  }
  public readonly id: string;
  public readonly vendor: Vendor;
  public readonly date: Date;
  public readonly comment?: string;

  private _status: PurchaseOrderStatus = PurchaseOrderStatus.DRAFT;
  private _lineItems: PurchaseOrderLineItem[] = [];
  private _confirmComment?: string;
  private _cancelComment?: string;
  private _dateConfirmed?: Date;
  private _dateCancelled?: Date;

  constructor(
    vendor: Vendor,
    date: Date,
    comment?: string,
    id?: string
  ) {
    if (!vendor.isActive) { throw new DomainError("Vendor must be active."); }
    this.vendor = vendor;
    this.date = date;
    this.comment = comment;
    this.id = id ?? uuidv4();
  }

  // --- Behavior ---

  public addLineItem(item: PurchaseOrderLineItem) {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new DomainError("Can only add line items in DRAFT status.");
    }
    this._lineItems.push(item);
  }

  public removeLineItem(lineItemId: string) {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new DomainError("Can only remove line items in DRAFT status.");
    }
    this._lineItems = this._lineItems.filter((item) => item.id !== lineItemId);
  }

  public cancel(date: Date, comment: string) {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new DomainError("Only DRAFT purchase orders can be cancelled.");
    }

    const allDraft = this._lineItems.every((item) => item.status === LineItemStatus.DRAFT);
    if (this._lineItems.length > 0 && !allDraft) {
      throw new DomainError("All line items must be in DRAFT status to cancel.");
    }

    this._status = PurchaseOrderStatus.DRAFT_CANCELLED;
    this._cancelComment = comment;
    this._dateCancelled = date;

    this._lineItems.forEach((item) => item.cancel(this, date, comment));
  }

  public confirm(date: Date, comment: string) {
    if (this._status !== PurchaseOrderStatus.DRAFT) {
      throw new DomainError("Only DRAFT purchase orders can be confirmed.");
    }

    if (this._lineItems.length === 0) {
      throw new DomainError("Purchase order must have at least one line item.");
    }

    const allDraft = this._lineItems.every((item) => item.status === LineItemStatus.DRAFT);
    if (!allDraft) {
      throw new DomainError("All line items must be in DRAFT status to confirm.");
    }

    this._status = PurchaseOrderStatus.CONFIRMED;
    this._confirmComment = comment;
    this._dateConfirmed = date;

    this._lineItems.forEach((item) => item.confirm(this, date, comment));
  }
  public ownsLineItem(id: string): boolean {
    return this._lineItems.findIndex((item) => item.id === id) >= 0;
  }
}
