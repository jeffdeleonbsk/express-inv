export class Address {
    public constructor(
        private _line1: string,
        private _line2: string | null,
        private _zipCode: string,
        private _city: string,
        private _country: string
    ){}

}