import { DomainError } from "../../common/domainError";
import { Address } from "./address";

export class Location {
    public constructor(
        private _code: string,
        private _name: string,
        private _description: string,
        private _isActive: boolean,
        private _address: Address | null
    ) {

    }
    public get code(): string {
        return this._code;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public get name(): string {
        return this._name;
    }
    public get description(): string {
        return this._description;
    }
    public get address(): Address | null {
        return this._address;
    }
}
