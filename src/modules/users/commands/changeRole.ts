import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IUserDb } from "../iUserDb";
import { Role } from "../models/role";
import { User } from "../models/user";

export class ChangeRoleRequest {
    constructor(public userId: string, public roleCode: string) {}
}

export class ChangeRoleResponse {
    public static mapFromUser(user: User): ChangeRoleResponse {
        return new ChangeRoleResponse(user.id, user.role);
    }
    constructor(public id?: string, public roleCode?: Role | null) {}
}

export class ChangeRoleCmd extends BaseCommand<ChangeRoleRequest, ChangeRoleResponse> {
    private db: IUserDb;
    constructor(req: ChangeRoleRequest, db: IUserDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<ChangeRoleResponse>> {
        const user = await this.db.GetUserById(this.request.userId);
        if (!user) {
            return Result.appFailed("User not found", "No user found with the given ID");
        }
        const newRole = await this.db.GetRoleByCode(this.request.roleCode);
        if (!newRole) {
            return Result.appFailed("Role not found", "No role found with the given code");
        }
        user.changeRole(newRole);
        await this.db.Update(user);
        return Result.Ok(ChangeRoleResponse.mapFromUser(user));
    }
    protected getValidationRules(): any {
        return {
            userId: "required|string",
            roleCode: "required|string"
        };
    }
}
