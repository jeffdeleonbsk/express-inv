
import { BaseCommand } from "../../common/baseCommand";
import { IAuthService } from "../../common/iAuthUserService";
import { Result } from "../../common/result";
import { IAuthDb } from "../iAuthDb";
export class LoginUserRequest {
    public constructor(
        public email: string,
        public password: string,
    ) {}
}
export class LoginUserResponse {
    public constructor(
        public id: string,
        public token: string
    ) {}
}

export class LoginUserCmd extends BaseCommand<LoginUserRequest, LoginUserResponse> {
    private db: IAuthDb;
    private authService: IAuthService;
    public constructor(req: LoginUserRequest, db: IAuthDb, authService: IAuthService) {
        super(req);
        this.db = db;
        this.authService = authService;
    }
    public async doCommand(): Promise<Result<LoginUserResponse>> {
        const usr = await this.db.GetUserByEmail(this.request.email);
        if (!usr) {
            return Result.domainFailed("Login failed");
        }
        if (await usr.checkPassword(this.request.password) === false) {
            return Result.domainFailed("Login failed");
        }
        const token = this.authService.getToken({ userId: usr.id, username: usr.email });
        return Result.Ok(new LoginUserResponse(usr.id, token));
    }
    protected async checkAuthorization(): Promise<Result<LoginUserResponse>> {
        return Result.Ok(null!);
    }
    protected getValidationRules(): any {
        return {
          email: "required|email",
          password: "required|string|minLength:6"
        };
    }

}
