
// Immutable Entities ---

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
  private constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly isRefrigerated: boolean
  ) {}
  public canStore(product: Product): boolean {
    return product.needRefrigeration === this.isRefrigerated;
  }
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

export abstract class BaseUser {
    public get id(): string {
        return this._id;
    }
    public get firstname(): string {
        return this._firstname;
    }
    public get lastname(): string {
        return this._lastname;
    }
    public get email(): string {
        return this._email;
    }
    protected constructor(
        protected _id: string,
        protected _firstname: string,
        protected _lastname: string,
        protected _email: string
    ) {
    }
    public abstract canRead(): boolean;
    public abstract canReadOwn(): boolean;
    public abstract canList(): boolean;
    public abstract canListOwn(): boolean;
    public abstract canCreate(): boolean;
    public abstract canUpdateOwn(): boolean;
    public abstract canDeleteOwn(): boolean;

}
