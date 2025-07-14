// inventory-domain-model.ts
import { v4 as uuidv4 } from "uuid";

import { MutableObject } from "../../common/mutableObject";
import { Product, Warehouse } from "../../domain/common/commonEntities";
import { Quantity } from "../../domain/common/genericValueObjects";

export class InventoryEntry {

  public static fromDB(params: {
    id: string;
    product: Product;
    warehouse: Warehouse;
    quantity: Quantity;
  }): InventoryEntry {
    return new InventoryEntry(params.id, params.product, params.warehouse, params.quantity);
  }

  public static createNew(
    product: Product | null,
    warehouse: Warehouse | null,
    initialQuantity: Quantity = new Quantity(0, "pcs")
  ): InventoryEntry {
    if (!product || !warehouse) {
      throw new Error("Product and warehouse must be provided.");
    }
    if (!warehouse.isActive) {
      throw new Error("Warehouse is not active.");
    }
    if (!product.isActive) {
      throw new Error("Product is not active.");
    }
    if (!warehouse.canStore(product)) {
      throw new Error("Warehouse cannot store this product type.");
    }
    return new InventoryEntry("INV-" + uuidv4(), product, warehouse, initialQuantity);
  }
  private _quantity: Quantity;

  private constructor(
    public readonly id: string,
    public readonly product: Product,
    public readonly warehouse: Warehouse,
    quantity: Quantity = new Quantity(0, "pcs")
  ) {
    this._quantity = quantity;
  }

  public get quantity(): Quantity {
    return this._quantity;
  }

  public addStock(deliveredQuantity: Quantity): void {
    if (!this.warehouse.isActive) {
      throw new Error("Warehouse is not active.");
    }
    this._quantity = new Quantity(this.quantity.value + deliveredQuantity.value, this.quantity.unit);
  }

  public takeStock(quantityTaken: Quantity): void {
    this.ensureSufficientStock(quantityTaken);
    this._quantity = new Quantity(this.quantity.value - quantityTaken.value, this.quantity.unit);
  }

  private ensureSufficientStock(quantityTaken: Quantity): void {
    if (quantityTaken.value > this.quantity.value) {
      throw new Error("Not enough stock available.");
    }
  }
}
