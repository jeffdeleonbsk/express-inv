
export abstract class MutableObject {
    private _isDirty: boolean = false;
    private _isNew: boolean = false;
    private _isDeleted: boolean = false;

    public get isDirty(): boolean {
        return this._isDirty;
    }
    public set isDirty(value: boolean) {
        this._isDirty = value;
    }
    public get isNew(): boolean {
        return this._isNew;
    }
    public set isNew(value: boolean) {
        this._isNew = value;
    }
    public get isDeleted(): boolean {
        return this._isDeleted;
    }
    public set isDeleted(value: boolean) {
        this._isDeleted = value;
    }

}
