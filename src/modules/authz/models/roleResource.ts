import { Role } from "./role";

// Value Object
export class RoleResource {
    public static fromDb(
        resourceCode: string,
        action: string,
        blanketAllow: boolean,
        allowOnlyOnOwnResources: boolean
    ) {
        return new RoleResource( resourceCode, action,  blanketAllow, allowOnlyOnOwnResources);
    }    
    private constructor(
        private _resourceCode: string,
        private _action: string,
        private _blanketAllow: boolean,
        private _allowOnlyOnOwnResources: boolean,

    ) {

    }
    isAllowed(userId:string, resourceOwnerId:string|undefined): boolean {
        if (this._blanketAllow) return true;
        if (this._allowOnlyOnOwnResources && resourceOwnerId) {
            return (userId === resourceOwnerId);
        }
        return false;
    }
}
