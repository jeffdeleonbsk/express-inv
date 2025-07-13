
// --- Value Objects / Entities ---

export class Vendor {
  public static fromDb(
    id: string,
    shortCode: string,
    name: string,
    isActive: boolean
  ) {
    return new Vendor(id, shortCode, name, isActive);
  }
  private constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly name: string,
    public readonly isActive: boolean
  ) {}
}

export class Warehouse {
  public static fromDb(
    id: string,
    shortCode: string,
    name: string,
    isActive: boolean,
    isRefrigerated: boolean
  ) {
    return new Warehouse(id, shortCode, name, isActive, isRefrigerated);
  }
  public canStore(product: Product): boolean {
    return product.needRefrigeration === this.isRefrigerated;
  }
  private constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly isRefrigerated: boolean
  ) {}
}

export class Product {
  public static fromDb(
    id: string,
    sku: string,
    name: string,
    isActive: boolean,
    needRefrigeration: boolean
  ) {
    return new Product(id, sku, name, isActive, needRefrigeration);
  }
  private constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly needRefrigeration: boolean
  ) {}
}
