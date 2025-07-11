import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { UserStatus } from "../../domain/common/enums";
import { IUserDb } from "../iUserDb";
import { User } from "../models/user";

export class ActivateUserRequest {
    constructor(public userId: string) {}
}

export class ActivateUserResponse {
    public static mapFromUser(user: User): ActivateUserResponse {
        return new ActivateUserResponse(user.id, user.status);
    }
    constructor(public id?: string, public status?: UserStatus) {}
}

export class ActivateUserCmd extends BaseCommand<ActivateUserRequest, ActivateUserResponse> {
    private db: IUserDb;
    constructor(req: ActivateUserRequest, db: IUserDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<ActivateUserResponse>> {
        const user = await this.db.GetUserById(this.request.userId);
        if (!user) {
            return Result.appFailed("User not found", "No user found with the given ID");
        }
        user.activateUser();
        await this.db.Update(user);
        return Result.Ok(ActivateUserResponse.mapFromUser(user));
    }
    protected getValidationRules(): any {
        return {
            userId: "required|string"
        };
    }
}
