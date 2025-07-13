
import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../../common/domainError";
import { LineItemStatus, PurchaseOrderStatus } from "../../domain/common/enums";
import { ILineItemParent } from "./iLineItemParent";
import { PurchaseOrderLineItem } from "./PurchaseOrderLineItem";
import { Vendor } from "./valueObjects";

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
public static fromDb(params: {
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
      params.id,
      params.vendor,
      params.date,
      params.comment
    );

    po._status = params.status;
    po._lineItems = params.lineItems;
    po._confirmComment = params.confirmComment;
    po._cancelComment = params.cancelComment;
    po._dateConfirmed = params.dateConfirmed;
    po._dateCancelled = params.dateCancelled;

    return po;
  }

  public static createNew(
    vendor: Vendor|null,
    date: Date,
    comment?: string
  ): PurchaseOrder {
    if (vendor === null || vendor === undefined) {
      throw new DomainError("Vendor must be provided.");
    }
    if (!vendor.isActive) { throw new DomainError("Vendor must be active."); }
    const id = uuidv4();
    return new PurchaseOrder(id, vendor, date, comment);
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

  private constructor(
    id: string,
    vendor: Vendor,
    date: Date,
    comment?: string
  ) {
    this.vendor = vendor;
    this.date = date;
    this.comment = comment;
    this.id = id;
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
export { PurchaseOrderLineItem };
