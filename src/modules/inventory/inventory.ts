// inventory-domain-model.ts
import { v4 as uuidv4 } from "uuid";

export class Product {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly needsRefrigeration: boolean,
    public readonly isActive: boolean
  ) {}
}

export class Warehouse {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly isRefrigerated: boolean,
    public readonly isActive: boolean
  ) {}

  canStore(product: Product): boolean {
    return product.needsRefrigeration === this.isRefrigerated;
  }
}

export class InventoryEntry {
  private quantity: number;

  private constructor(
    public readonly id: string,
    public readonly product: Product,
    public readonly warehouse: Warehouse,
    quantity: number = 0
  ) {
    this.quantity = quantity;
  }

  getQuantity(): number {
    return this.quantity;
  }

  addStock(deliveredQuantity: number): void {
    if (!this.warehouse.isActive) {
      throw new Error("Warehouse is not active.");
    }    
    this.quantity += deliveredQuantity;
  }


  takeStock(quantityTaken: number): void {
    this.ensureSufficientStock(quantityTaken);
    this.quantity -= quantityTaken;
  }

  private ensureSufficientStock(quantityTaken: number): void {
    if (quantityTaken > this.quantity) {
      throw new Error("Not enough stock available.");
    }
  }

  static fromDB(params: {
    id: string;
    product: Product;
    warehouse: Warehouse;
    quantity: number;
  }): InventoryEntry {
    return new InventoryEntry(params.id, params.product, params.warehouse, params.quantity);
  }

  static createNew(product: Product, warehouse: Warehouse, initialQuantity: number = 0): InventoryEntry {
    if (!warehouse.isActive) {
      throw new Error("Warehouse is not active.");
    }
    if (!product.isActive) {
      throw new Error("Product is not active.");
    }
    if (!warehouse.canStore(product)) {
      throw new Error("Warehouse cannot store this product type.");
    }    
    return new InventoryEntry(uuidv4(), product, warehouse, initialQuantity);
  }
}