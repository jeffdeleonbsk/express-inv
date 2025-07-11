import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { UserStatus } from "../../domain/common/enums";
import { IUserDb } from "../iUserDb";
import { User } from "../models/user";

export class DeactivateUserRequest {
    constructor(public userId: string) {}
}

export class DeactivateUserResponse {
    public static mapFromUser(user: User): DeactivateUserResponse {
        return new DeactivateUserResponse(user.id, user.status);
    }
    constructor(public id?: string, public status?: UserStatus) {}
}

export class DeactivateUserCmd extends BaseCommand<DeactivateUserRequest, DeactivateUserResponse> {
    private db: IUserDb;
    constructor(req: DeactivateUserRequest, db: IUserDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<DeactivateUserResponse>> {
        const user = await this.db.GetUserById(this.request.userId);
        if (!user) {
            return Result.appFailed("User not found", "No user found with the given ID");
        }

        user.deactivateUser();
        await this.db.Update(user);
        return Result.Ok(DeactivateUserResponse.mapFromUser(user));
    }
    protected getValidationRules(): any {
        return {
            userId: "required|string"
        };
    }
}
