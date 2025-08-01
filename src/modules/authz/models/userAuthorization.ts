import { Role } from "./role";
import { RoleResource } from "./roleResource";

export class UserAuthorization {

    public static fromDb(params: {
        id: string;
        isActive:boolean;
        role: Role|undefined;
        roleResource: RoleResource | undefined;
    }){
        return new UserAuthorization(params.id, params.isActive, params.role, params.roleResource);
    }
    private constructor(
        private id: string,
        private isActive: boolean,
        private role: Role|undefined,
        private roleResource: RoleResource|undefined
    ) {
    }
    
    isAuthorized(resourceOwnerId:string|undefined): boolean {
        if (!this.isActive) return false;
        if (!this.role) return false;
        if (!this.roleResource) return false;
        if (!this.role.isActive) return false;
        return this.roleResource.isAllowed(this.id, resourceOwnerId);
    }
}
