import { DomainError } from "../../common/domainError";

// value object
export interface IRoleAccess {
        id: number;
        roleCode: string;
        reourceCode: string;
        canList: boolean;
        canReadOwnObject: boolean;
        canUpdateOwnObject: boolean;
        canDeleteOwnObject: boolean;
        canDeleteObject: boolean;
        canAddObject: boolean;
        canUpdateObject: boolean;
}
export class RoleAccess {
    public static createFrom({
        id, roleCode, reourceCode, canList,
        canReadOwnObject, canUpdateOwnObject,
        canDeleteOwnObject, canDeleteObject,
        canAddObject, canUpdateObject
    }: IRoleAccess): RoleAccess {
        return new RoleAccess(
            id, roleCode, reourceCode, canList,
            canReadOwnObject, canUpdateOwnObject,
            canDeleteOwnObject, canDeleteObject,
            canAddObject, canUpdateObject
        );

    }
    public constructor(
        public readonly id: number,
        public readonly roleCode: string,
        public readonly reourceCode: string,
        public readonly canList: boolean,
        public readonly canReadOwnObject: boolean,
        public readonly canUpdateOwnObject: boolean,
        public readonly canDeleteOwnObject: boolean,
        public readonly canDeleteObject: boolean,
        public readonly canAddObject: boolean,
        public readonly canUpdateObject: boolean
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

}
