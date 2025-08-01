import { BaseQuery } from "../../common/baseQuery";
import { DomainError } from "../../common/domainError";
import { Result } from "../../common/result";
import { IAuthorizationDb } from "../iAuthorizationDb";

export class GetUserAccessByIdRequest {
    public constructor(
        public id: string,
        public resourceCode: string,
        public action: string,
        public resourceOwnerId?: string,
        public resourceId?: string 
    ) {}
}
export class GetUserAccessByIdResponse {
    public constructor(
        public allow: boolean | false
    ) {}
}

export class GetUserAccessByIdQuery extends BaseQuery<GetUserAccessByIdRequest, GetUserAccessByIdResponse> {
    private db: IAuthorizationDb;
    public constructor(req: GetUserAccessByIdRequest, db: IAuthorizationDb) {
        super(req);
        this.db = db;
    }
    protected async doQuery(): Promise<Result<GetUserAccessByIdResponse>> {
        const usr = await this.db.getUserAuthz(
            this.request.id, 
            this.request.resourceCode, 
            this.request.action
        );
        if (!usr) {
            throw new DomainError("Unable to get Authorization.");
        }
        const allowed = usr.isAuthorized(this.request.resourceOwnerId);
        return Result.Ok(new GetUserAccessByIdResponse(allowed));
    }
    protected getValidationRules(): any {
        return {
            id: "required|id",
            resourceCode: "required|string",
            action: "required|string"
        };
    }

}
