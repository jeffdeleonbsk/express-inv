import { DomainError } from "../../../common/domainError";
import { RoleAccess } from "./roleAccess";

// Value Object
export class Role {
    public readonly roleAccessList: RoleAccess[] = [];

    public constructor(
        public readonly code: string,
        public readonly isActive: number,
        accessList: RoleAccess[] | null
    ) {
        accessList?.forEach((roleAccess) => {
            this.addRoleAccess(roleAccess);
        });
    }

    public addRoleAccess(roleAccess: RoleAccess): void {
        if (roleAccess.roleCode !== this.code) {
            throw new DomainError("Cannot add a different role code");
        }

        const index = this.roleAccessList.findIndex((obj) => obj.reourceCode === roleAccess.reourceCode);
        if (index < 0) {
            this.roleAccessList.push(roleAccess);
        }
        this.roleAccessList[index] = roleAccess;
    }
    public getRoleAccess(resourceCode: string): RoleAccess|undefined {
        if (this.roleAccessList) {
            return this.roleAccessList?.find((ra) => {
                return ra.reourceCode === resourceCode;
            });
        }
        return undefined;
    }

}
