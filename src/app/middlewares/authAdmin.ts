import { NextFunction, Request, Response, Router } from "express";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { Result } from "../../modules/common/result";
import { getInstance } from "../common/diContainer";
import TokenMap from "../common/tokenMap";

export const authAdmin = async (request: Request, response: Response, next: NextFunction) => {
    const service: IAuthService = getInstance(TokenMap.authService);
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        response.status(401).json(Result.appFailed("No token provided", "You must provide a valid JWT token in the Authorization header"));
        return;
    }
    const userId = service.getUserId(authHeader);
    if (!userId) {
        response.status(401).json(Result.appFailed("No valid token provided", "You must provide a valid JWT token in the Authorization header"));
        return;
    }
    const db = getInstance(TokenMap.authDb);
    const ret = await db.GetUserById(userId);
    request.body.authUserId = userId; // Store userId in request for later use
    if (!ret || ret.roleCode !== "ADMIN") {
        response.status(403).json(Result.appFailed("Forbidden", "You do not have permission to access this resource"));
        return;
    }
    next();
};
