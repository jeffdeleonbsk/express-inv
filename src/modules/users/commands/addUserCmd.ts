
import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IEmailExistsService } from "../domain/iEmailExistsService";

import { IUserDb } from "../iUserDb";
import { Role } from "../domain/role";
import { User } from "../domain/user";
import { getInstance } from "../../common/diContainer";
import { UserStatus } from "../../domain/common/enums";

export class AddUserRequest {
    public constructor(
        public firstname: string,
        public lastname: string,
        public email: string,
        public password: string,
        public status?: UserStatus|null,
        public roleCode?: string
    ) {
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
        public id?: string,
        public firstname?: string,
        public lastname?: string,
        public email?: string,
        public status?: string,
        public role?: Role | null
    ) {}
}

export class AddUserCmd extends BaseCommand<AddUserRequest, AddUserResponse> {
    private db: IUserDb;
    private emailService;
    public constructor(req: AddUserRequest, db: IUserDb, emailService: IEmailExistsService) {
        super(req);
        this.db = db;
        this.emailService = emailService;
    }
    private async mapRequestToUser(req: AddUserRequest, db: IUserDb): Promise<Result<User>> {
        const status = req.status?req.status:UserStatus.INACTIVE;
        const role = req.roleCode?req.roleCode: "";
        return  User.createNew(
            req.firstname,
            req.lastname,
            req.email,
            req.password,
            status,
            await db.GetRoleByCode(role, true),
            this.emailService
        );
    }
    public async doCommand(): Promise<Result<AddUserResponse>> {
        const usrRet = await this.mapRequestToUser(this.request,this.db);
        if (usrRet.isSuccess === false) {
            return usrRet;
        }
        const ret = await this.db.Add(usrRet.result);
        const usrAdd = await this.db.GetUserById(usrRet.result.id, true, false);
        if (usrAdd) {
            return Result.Ok(AddUserResponse.mapFromUser(usrAdd));
        }
        return Result.domainFailed("Unable to retrieve the inserted User");
    }
    protected getValidationRules(): any {
        return {
          email: "required|email",
          firstname: "required|string|minLength:3",
          lastname: "required|minLength:3"
        };
    }
}
