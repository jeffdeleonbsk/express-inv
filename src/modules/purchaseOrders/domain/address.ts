export class Address {
    public constructor(
        private _line1: string,
        private _line2: string | null,
        private _zipCode: string,
        private _cityCode: string,
        private _countryCode: string
    ) {}
    public get addressLine1(): string {
        return this._line1;
    }
    public get addressLine2(): string | null {
        return this._line2;
    }
    public get zipCode(): string {
        return this._zipCode;
    }
    public getCityCode(): string {
        return this._cityCode;
    }
    public getCountryCode(): string {
        return this._countryCode;
    }
}
