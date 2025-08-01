import { IUserAccessService, UserAccess } from "../modules/domain/interfaces/iUserAccessService";

export class MockUserAccessService implements IUserAccessService {

    private users: UserAccess[] = [];
    async isAllowed(userId: string, resourceCode: string, action: string, resourceId?: string | undefined, resourceOwnerId?: string | undefined): Promise<boolean> {
        const idx = this.users.findIndex((i) => 
            i.userId === userId && 
            i.resourceCode === resourceCode && 
            i.action === action 
        );
        if (idx < 0) {
            return false;
        }
        return this.users[idx].allow;
    }

    
    public addUser(user: UserAccess) {
        const idx = this.users.findIndex((i) => i.userId === user.userId);
        if (idx < 0) {
            this.users.push(user);
        }
        this.users[idx] = user;
    }

}
