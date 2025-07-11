import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IUserDb } from "../iUserDb";

export class UpdateUserRequest {
    public constructor(
        public id: string,
        public firstname: string,
        public lastname: string
    ) {
    }
}
export class UpdateUserResponse {
    public constructor(
        public id: string,
        public firstname: string,
        public lastname: string
    ) {
    }
}
export class UpdateUserNameCmd extends BaseCommand<UpdateUserRequest, UpdateUserResponse> {
    private db: IUserDb;
    public constructor(req: UpdateUserRequest, db: IUserDb) {
      super(req);
      this.db = db;
    }
    public async doCommand(): Promise<Result<UpdateUserResponse>> {
        const usr = await this.db.GetUserById(this.request.id);
        if (usr) {
            usr.updateName(this.request.firstname, this.request.lastname);
            const changed = await this.db.Update(usr);
            if (changed > 0) {
                return Result.Ok(new UpdateUserResponse(
                    usr.id, usr.firstname, usr.lastname
                ));
            }
            return Result.appFailed("Unable to persist updates");
        }
        return Result.domainFailed("Cannot find user");
    }
    protected getValidationRules(): any {
        return {
            id: "required",
            firstname: "required|string|minLength:3",
            lastname: "required|minLength:3"
        };
    }
}
