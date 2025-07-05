import { BaseCommand } from "../../common/baseCommand";
import { IExecutor } from "../../common/executor";
import { Result } from "../../common/result";

export class UpdateUserRequest {
    public firstName: string;
    public lastName: string;
    public email: string;
    public constructor(firstName: string, lastName: string, email: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
export class UpdateUserResponse {
    public token: string = "some_token";
    public id: number = 0;
    public firstName: string;
    public lastName: string;
    public email: string;
    public constructor(firstName: string, lastName: string, email: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
export class UpdateUserCmd extends BaseCommand<UpdateUserRequest, UpdateUserResponse> {
    public constructor(req: UpdateUserRequest, exec: IExecutor<UpdateUserResponse>) {
      super(req, exec);
    }
    public  async doCommand(): Promise<Result<UpdateUserResponse>> {
        const response  = new UpdateUserResponse(
            this.request.firstName,
            this.request.lastName,
            this.request.email
        );
        response.id = 77777;
        return Result.Ok(response);
    }
}
