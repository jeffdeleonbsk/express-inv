import { NextFunction, Request, Response, Router } from "express";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { Result } from "../../modules/common/result";
import { getInstance } from "../common/diContainer";
import TokenMap from "../common/tokenMap";
import { BaseCommand } from "../../modules/common/baseCommand";
import { IUserAccessService } from "../../modules/domain/interfaces/iUserAccessService";
import { BaseQuery } from "../../modules/common/baseQuery";

export const authJwt = async (request: Request, response: Response, next: NextFunction) => {
    const service: IAuthService = getInstance(TokenMap.authService);
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        response.status(403).json(Result.appFailed("No token provided", "You must provide a valid JWT token in the Authorization header"));
        return;
    }
    const userId = service.getUserId(authHeader);
    if (!userId) {
        response.status(403).json(Result.appFailed("No valid token provided", "You must provide a valid JWT token in the Authorization header"));
        return;
    }
    request.body.authUserId = userId;
    next();
};

export const checkAuthorizationThenExecute = async <T extends object, U extends object>(
    res: Response,
    cmd: BaseCommand<T, U>, 
    resourceCode: string, 
    action: string,
    userId: string
) => {
    const userAccess = getInstance(TokenMap.userAccessService) as IUserAccessService;
    const allowed = await userAccess.isAllowed(userId, resourceCode, action);
    if (!allowed) {
        res.status(401).json(Result.appFailed("Unautorized", "You are not authorized to perform this action."));
    }
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);    
}
export const checkAuthorizationThenQuery = async <T extends object, U extends object>(
    res: Response,
    query: BaseQuery<T, U>, 
    resourceCode: string, 
    action: string,
    userId: string
) => {
    const userAccess = getInstance(TokenMap.userAccessService) as IUserAccessService;
    const allowed = await userAccess.isAllowed(userId, resourceCode, action);
    if (!allowed) {
        res.status(401).json(Result.appFailed("Unautorized", "You are not authorized to perform this action."));
    }
    const result = await query.get();
    res.status(result.isSuccess ? 200 : 422).json(result);    
}