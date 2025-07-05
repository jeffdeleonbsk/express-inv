export class Product {
    public constructor(
        private _id: number,
        private _sku: string,
        private _unitPrice: number,
        private _isActive: boolean
    ){}
    public get id() : number {
        return this._id;
    }
    public get sku() : string {
        return this._sku;
    }
    public get unitPrice() : number {
        return this._unitPrice;
    }
    public get isActive() : boolean {
        return this._isActive;
    }
}