import { Location } from "./location";

export class Warehouse {
    public constructor(
        private _code: string,
        private _name: string,
        private _description: string,
        private _isActive: boolean,
        private _location: Location
    ) {}
    public get code() : string {
        return this._code;
    }
    public get name() : string {
        return this._name;
    }
    public get isActive() : boolean {
        return this._isActive;
    }
    public get location() : Location {
        return this._location;
    }
    public get description() : string {
        return this._description;
    }

}