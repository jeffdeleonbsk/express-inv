
// Value Object
export class RoleResource {
    public constructor(
        private _code: string,
        private _isActive: number
    ) {}
    public get code(): string {
        return this._code;
    }

}
