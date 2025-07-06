import { DomainError } from "../../common/domainError";

export class Product {
    public constructor(
        private _id: number,
        private _sku: string,
        private _unitPrice: number,
        private _needsRefrigeration: boolean,
        private _isActive: boolean
    ) {
        // if (this.isActive == false) {
        //     throw new DomainError(`product to be used must be Active. {Location Code: ${this._sku})`);
        // }
    }
    public get id(): number {
        return this._id;
    }
    public get sku(): string {
        return this._sku;
    }
    public get unitPrice(): number {
        return this._unitPrice;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public get needsRefrigeration(): boolean {
        return this._needsRefrigeration;
    }
}
