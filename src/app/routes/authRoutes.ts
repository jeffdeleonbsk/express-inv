import { Request, Response, Router } from "express";
import { LoginUserCmd, LoginUserRequest } from "../../modules/auth/commands/loginUser";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { getInstance } from "../common/diContainer";
import TokenMap from "../common/tokenMap";

const router: Router = Router();

// Login route
router.post("/login", async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const cmdRequest = new LoginUserRequest(email, password);
    const db = getInstance(TokenMap.authDb);
    const authService: IAuthService = getInstance(TokenMap.authService);
    const cmd = new LoginUserCmd(cmdRequest, db, authService);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});
export default router;
