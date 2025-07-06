import { DomainError } from "../../common/domainError";
import { Address } from "./address";

export class Vendor {
    public constructor(
        private _id: number,
        private _name: string,
        private _isActive: boolean,
        private _address: Address | null
    ) {
        // if (this._isActive == false) {
        //     throw new DomainError(`Vendor to be used must be Active. {Vendor Code: ${this._name})`);
        // }
        // if (this._address == null) {
        //     throw new DomainError(`Vendor to be used must be have a valid address. {Vendor Code: ${this._name})`);
        // }
    }
    public checkValidityForPO(): void {
        if (this.isActive === false) {
            throw new DomainError("Must use an active vendor");
        }
        if (this.address === null) {
            throw new DomainError("Vendor must have valid Address");
        }
    }
    public get id(): number {
        return this._id;
    }
    public get isActive(): boolean {
        return this._isActive;
    }
    public get address(): Address | null {
        return this._address;
    }
}
