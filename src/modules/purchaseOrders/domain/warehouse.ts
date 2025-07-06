import { DomainError } from "../../common/domainError";
import { Location } from "./location";

export class Warehouse {
    public constructor(
        private _code: string,
        private _name: string,
        private _description: string,
        private _isRefrigerated: boolean,
        private _isActive: boolean,
        private _location: Location
    ) {
        // if (this.isActive == false) {
        //     throw new DomainError(`Warehouse to be used must be Active. {Location Code: ${this._code})`);
        // }
    }
    public get code(): string {
        return this._code;
    }
    public get name(): string {
        return this._name;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public get location(): Location {
        return this._location;
    }
    public get description(): string {
        return this._description;
    }
    public get isRefrigerated(): boolean {
        return this._isRefrigerated;
    }

}
