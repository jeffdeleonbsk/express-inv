import { Address } from "./address";

export class Location {
    public constructor(
        private _code: string,
        private _name: string,
        private _description: string,
        private _isActive: boolean,
        private _address: Address | null
    ){
    }
    public get code() : string {
        return this._code;
    }
    public get isActive() : boolean {
        return this._isActive;
    }
}