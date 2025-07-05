import { DomainError } from "../../common/domainError";
import { RoleAccess } from "./roleAccess";

// Value Object
export class Role {
    private _roleAccessList: RoleAccess[] = [];

    public constructor(
        private _code: string,
        private _isActive: number,
        accessList: RoleAccess[] | null
    ) {
        accessList?.forEach((roleAccess) => {
            this.addRoleAccess(roleAccess);
        });
    }
    public get code(): string {
        return this._code;
    }
    public get roleAccessList(): RoleAccess[] | null {
        return this._roleAccessList;
    }
    public get isActive(): boolean {
        return this._isActive > 0;
    }
    public addRoleAccess(roleAccess: RoleAccess): void {
        if (roleAccess.roleCode !== this._code) {
            throw new DomainError("Cannot add a different role code");
        }

        const index = this._roleAccessList.findIndex((obj) => obj.reourceCode === roleAccess.reourceCode);
        if (index < 0) {
            this._roleAccessList.push(roleAccess);
        }
        this._roleAccessList[index] = roleAccess;
    }
    public getRoleAccess(resourceCode: string): RoleAccess|undefined {
        if (this._roleAccessList) {
            return this._roleAccessList?.find((ra) => {
                return ra.reourceCode === resourceCode;
            });
        }
        return undefined;
    }

}
