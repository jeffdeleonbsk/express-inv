
export interface UserAccess {
    userId: string;
    roleCode: string;
    resourceCode: string;
    action: string;    
    allow: boolean;
    resourceId?: string|undefined;
    resourceOwnerId?: string|undefined;
}

export interface IUserAccessService {
    isAllowed(
        userId: string, 
        resourceCode: string, 
        action: string,
        resourceId?: string|undefined,
        resourceOwnerId?: string|undefined
    ): Promise<boolean>;
}
