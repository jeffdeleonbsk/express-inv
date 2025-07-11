import { NextFunction, Request, Response, Router } from "express";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { Result } from "../../modules/common/result";
import { IEmailExistsService } from "../../modules/domain/interfaces/iEmailExistsService";
import { ActivateUserCmd, ActivateUserRequest } from "../../modules/users/commands/activateUser";
import { AddUserCmd, AddUserRequest } from "../../modules/users/commands/addUserCmd";
import { DeactivateUserCmd, DeactivateUserRequest } from "../../modules/users/commands/deactivateUser";
import { UpdateUserNameCmd, UpdateUserRequest } from "../../modules/users/commands/updateUserNameCmd";
import { getInstance } from "../common/diContainer";
import TokenMap from "../common/tokenMap";

const router: Router = Router();
const authAdmin = async (request: Request, response: Response, next: NextFunction) => {
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
router.get("/:id", authAdmin, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const ret = await db.GetUserById(request.params.id);
    response.json(ret);
});

router.post("/", authAdmin, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const emailService: IEmailExistsService = getInstance(TokenMap.emailExistsService);
    const {firstname, lastname, email, status, role} = request.body;

    const cmdRequest = new AddUserRequest(firstname, lastname, email, status, role);
    const cmd = new AddUserCmd(cmdRequest, db, emailService);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});

router.put("/:id/update-names", authAdmin, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const {firstname, lastname} = request.body;

    const cmdRequest = new UpdateUserRequest(request.params.id, firstname, lastname);
    const cmd = new UpdateUserNameCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});

router.put("/:id/activate", authAdmin, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const cmdRequest = new ActivateUserRequest(request.params.id);
    const cmd = new ActivateUserCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});
router.put("/:id/deactivate", authAdmin, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const cmdRequest = new DeactivateUserRequest(request.params.id);
    const cmd = new DeactivateUserCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});
export default router;
