import { DomainError } from "../../common/domainError";

// value object
export interface IRoleAccess {
        _id: number;
        _roleCode: string;
        _reourceCode: string;
        _canList: number;
        _canReadOwnObject: number;
        _canUpdateOwnObject: number;
        _canDeleteOwnObject: number;
        _canDeleteObject: number;
        _canAddObject: number;
        _canUpdateObject: number;
}
export class RoleAccess {
    public static createFrom({
        _id, _roleCode, _reourceCode, _canList,
        _canReadOwnObject, _canUpdateOwnObject,
        _canDeleteOwnObject, _canDeleteObject,
        _canAddObject, _canUpdateObject
    }: IRoleAccess): RoleAccess {
        return new RoleAccess(
            _id, _roleCode, _reourceCode, _canList,
            _canReadOwnObject, _canUpdateOwnObject,
            _canDeleteOwnObject, _canDeleteObject,
            _canAddObject, _canUpdateObject
        );

    }
    public constructor(
        private _id: number,
        private _roleCode: string,
        private _reourceCode: string,
        private _canList: number,
        private _canReadOwnObject: number,
        private _canUpdateOwnObject: number,
        private _canDeleteOwnObject: number,
        private _canDeleteObject: number,
        private _canAddObject: number,
        private _canUpdateObject: number
    ) {
        // we can validate that the settings make sense
        if (this.canList === false) {
            if (this.canUpdateObject) {
                throw new DomainError("Update access must be more strict than read access");
            }
            if (this.canAddObject) {
                throw new DomainError("Add access must be more strict than read access");
            }
            if (this.canDeleteObject) {
                throw new DomainError("Delete access must be more strict than read access");
            }
        }
        if (this.canReadOwnObject === false) {
            if (this.canUpdateOwnObject) {
                throw new DomainError("Update access must be more strict than read access");
            }
            if (this.canDeleteOwnObject) {
                throw new DomainError("Delete access must be more strict than read access");
            }
        }
    }
    public get id(): number {
        return this._id;
    }
    public get roleCode(): string {
        return this._roleCode;
    }
    public get reourceCode(): string {
        return this._reourceCode;
    }
    public get canList(): boolean {
        return this._canList > 0;
    }
    public get canReadOwnObject(): boolean {
        return this._canReadOwnObject > 0;
    }
    public get canUpdateOwnObject(): boolean {
        return this._canUpdateOwnObject > 0;
    }
    public get canDeleteOwnObject(): boolean {
        return this._canDeleteOwnObject > 0;
    }
    public get canDeleteObject(): boolean {
        return this._canDeleteObject > 0;
    }
    public get canAddObject(): boolean {
        return this._canAddObject > 0;
    }
    public get canUpdateObject(): boolean {
        return this._canUpdateObject > 0;
    }

}
