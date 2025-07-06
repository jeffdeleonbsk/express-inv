import { Request, Response, Router } from "express";
import { AddUserCmd, AddUserRequest, AddUserResponse } from "./commands/addUserCmd";
import { UpdateUserNameCmd, UpdateUserRequest, UpdateUserResponse } from "./commands/updateUserNameCmd";

import { getInstance } from "../common/diContainer";
import { IExecutorFactory } from "../common/executor";
import { genericHandleJsonResult, genericHandleViewResult } from "../expressHelpers/handleResult";

const router: Router = Router();

router.get("/:id", async (request: Request, response: Response) => {
    const db = getInstance("UserDb");
    const ret = await db.GetUserById(request.params.id);
    response.json(ret);
  //  genericHandleJsonResult<AddUserRequest, AddUserResponse>(response, cmdRequest, cmdResult);
});
router.get("/test2", async (request: Request, response: Response) => {
    const db = getInstance("UserDb");
    const factory: IExecutorFactory = getInstance("ExecutorFactory");
    const cmdRequest = new AddUserRequest("jeff", "deleon", "jeffdeleonbsk@gmail.com", "active", "ADMIN");
    const cmd = new AddUserCmd(cmdRequest, db, factory.create<AddUserResponse>());
    const cmdResult = await cmd.execute();
    genericHandleJsonResult<AddUserRequest, AddUserResponse>(response, cmdRequest, cmdResult);
});

router.get("/test", async (request: Request, response: Response) => {

    const db = getInstance("UserDb");
    const factory: IExecutorFactory = getInstance("ExecutorFactory");
    const cmdRequest = new AddUserRequest("jeff2", "deleon2", "email@email.com", "active", "");
    const cmd = new AddUserCmd(cmdRequest, db, factory.create<AddUserResponse>());
    const cmdResult = await cmd.execute();
    genericHandleJsonResult<AddUserRequest, AddUserResponse>(response, cmdRequest, cmdResult);
});

router.put("/:id", async (request: Request, res: Response) => {
    const db = getInstance("UserDb");
    const factory: IExecutorFactory = getInstance("ExecutorFactory");
    const cmdRequest = new UpdateUserRequest(+request.params.id, request.body.firstname, request.body.lastname);
    const cmd = new UpdateUserNameCmd(cmdRequest, db, factory.create<UpdateUserResponse>());
    const cmdResult = await cmd.execute();
    genericHandleJsonResult<UpdateUserRequest, UpdateUserResponse>(res, cmdRequest, cmdResult);
});
export default router;
