import { BaseCommand } from "../../../common/baseCommand";
import { IExecutor } from "../../../common/executor";
import { Result } from "../../../common/result";
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
    public constructor(req: UpdateUserRequest, db: IUserDb, exec: IExecutor<UpdateUserResponse>) {
      super(req, exec);
      this.db = db;
    }
    public  async doCommand(): Promise<Result<UpdateUserResponse>> {
        const usr = await this.db.GetUserById(this.request.id, true, false );
        if (usr) {
            usr.updateName(this.request.firstname, this.request.lastname);
            const ret = await this.db.Update(usr);

            const usrRet = await this.db.GetUserById(this.request.id, false, false );
            return Result.Ok(new UpdateUserResponse(
                usr.id, usr.firstname, usr.lastname
            ));
        }
        return Result.domainFailed("Cannot find user");
    }
    protected getValidationRules(): any {
        return {
          firstname: "required|string|minLength:3",
          lastname: "required|minLength:3"
        };
    }
}
