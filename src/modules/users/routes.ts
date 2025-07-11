import { Request, Response, Router } from "express";
import { AddUserCmd, AddUserRequest, AddUserResponse } from "./commands/addUserCmd";
import { UpdateUserNameCmd, UpdateUserRequest, UpdateUserResponse } from "./commands/updateUserNameCmd";

import { getInstance } from "../common/diContainer";
import { IEmailExistsService } from "../domain/interfaces/iEmailExistsService";

const router: Router = Router();

router.get("/:id", async (request: Request, response: Response) => {
    const db = getInstance("UserDb");
    const ret = await db.GetUserById(request.params.id);
    response.json(ret);
});

router.post("/", async (request: Request, response: Response) => {
    const {firstname, lastname, email, status, role} = request.body;
    const cmdRequest = new AddUserRequest(firstname, lastname, email, status, role);
    const db = getInstance("UserDb");
    const emailService: IEmailExistsService = getInstance("EmailExistsService");
    const cmd = new AddUserCmd(cmdRequest, db, emailService);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});

router.put("/:id", async (request: Request, response: Response) => {
    const cmdRequest = new UpdateUserRequest(request.params.id, request.body.firstname, request.body.lastname);
    const db = getInstance("UserDb");
    const cmd = new UpdateUserNameCmd(cmdRequest, db);
    const cmdResult = await cmd.execute();
    response.status(cmdResult.isSuccess ? 200 : 422).json(cmdResult);
});
export default router;
