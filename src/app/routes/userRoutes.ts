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
import { authJwt } from "../middlewares/authMiddleware";
const router: Router = Router();

router.get("/:id", authJwt, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const ret = await db.GetUserById(request.params.id);
    response.json(ret);
});

router.post("/", authJwt, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const emailService: IEmailExistsService = getInstance(TokenMap.emailExistsService);
    const {firstname, lastname, email, status, role} = request.body;

    const cmdRequest = new AddUserRequest(firstname, lastname, email, status, role);
    const cmd = new AddUserCmd(cmdRequest, db, emailService);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});

router.put("/:id/update-names", authJwt, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const {firstname, lastname} = request.body;

    const cmdRequest = new UpdateUserRequest(request.params.id, firstname, lastname);
    const cmd = new UpdateUserNameCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});

router.put("/:id/activate", authJwt, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const cmdRequest = new ActivateUserRequest(request.params.id);
    const cmd = new ActivateUserCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});
router.put("/:id/deactivate", authJwt, async (request: Request, response: Response) => {
    const db = getInstance(TokenMap.userDb);
    const cmdRequest = new DeactivateUserRequest(request.params.id);
    const cmd = new DeactivateUserCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});
export default router;
