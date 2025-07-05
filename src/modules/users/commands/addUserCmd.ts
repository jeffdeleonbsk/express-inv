
import { BaseCommand } from "../../common/baseCommand";
import { IExecutor } from "../../common/executor";
import { Result } from "../../common/result";

import { Role } from "../domain/role";
import { User } from "../domain/user";
import { IUserDb } from "../iUserDb";

export class AddUserRequest {
    public constructor(
        public firstname: string,
        public lastname: string,
        public email: string,
        public status: string,
        public roleCode: string
    ) {
    }
    public async mapRequestToUser(db: IUserDb): Promise<Result<User>> {
        return  User.createNew(
            0,
            this.firstname,
            this.lastname,
            this.email,
            this.status,
            await db.GetRoleByCode(this.roleCode, true)
        );
    }
}
export class AddUserResponse {
    public static mapFromUser(usr: User): AddUserResponse {
        return new AddUserResponse(
            usr.id,
            usr.firstname,
            usr.lastname,
            usr.email,
            usr.status,
            usr.role
        );
    }
    public constructor(
        public id?: number,
        public firstname?: string,
        public lastname?: string,
        public email?: string,
        public status?: string,
        public role?: Role | null
    ) {}
}

export class AddUserCmd extends BaseCommand<AddUserRequest, AddUserResponse> {
    private db: IUserDb;
    public constructor(req: AddUserRequest, db: IUserDb, exec: IExecutor<AddUserResponse>) {
      super(req, exec);
      this.db = db;
    }
    public async doCommand(): Promise<Result<AddUserResponse>> {
        const usrRet = await this.request.mapRequestToUser(this.db);
        if (usrRet.isSuccess === false) {
            return usrRet;
        }

        const ret = await this.db.Add(usrRet.result);

        const usrAdd = await this.db.GetUserById(ret, true, false);
        if (usrAdd) {
            return Result.Ok(AddUserResponse.mapFromUser(usrAdd));
        }
        return Result.appFailed("Unable to retrieve the inserted User", "Unable to find inserted User");
    }
    protected getValidationRules(): any {
        return {
          email: "required|email",
          firstname: "required|string|minLength:3",
          lastname: "required|minLength:3"
        };
    }
}
