import { GetUserAccessByIdQuery, GetUserAccessByIdRequest } from "../../../modules/authz/queries/getUserAccessById";
import { IUserAccessService, UserAccess } from "../../../modules/domain/interfaces/iUserAccessService";
import { getInstance } from "../../common/diContainer";
import tokenMap from "../../common/tokenMap";

export class UserAccessService implements IUserAccessService {
    async isAllowed(userId: string, resourceCode: string, action: string, resourceId?: string | undefined, resourceOwnerId?: string | undefined): Promise<boolean> {
        const iAuthDb = getInstance(tokenMap.authDb);
        const request = new GetUserAccessByIdRequest(userId, resourceCode, action, resourceOwnerId, resourceId);
        const query = new GetUserAccessByIdQuery(request, iAuthDb);
        const ret = await query.get();
        if (ret.isSuccess) {
            return ret.result.allow;
        }
        return false;
    }


}
