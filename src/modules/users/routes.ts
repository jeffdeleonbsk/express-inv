import { Request, Response, Router } from "express";
import { AddUserCmd, AddUserRequest, AddUserResponse } from "./commands/addUserCmd";
import { UpdateUserCmd, UpdateUserRequest, UpdateUserResponse } from "./commands/updateUserCmd";

import { getInstance } from "../common/diContainer";
import { IExecutorFactory } from "../common/executor";
import { genericHandleJsonResult, genericHandleViewResult } from "../expressHelpers/handleResult";

const router: Router = Router();

router.get("/test2", async (request: Request, response: Response) => {
    const db = getInstance("UserDb");
    const factory: IExecutorFactory = getInstance("ExecutorFactory");
    const cmdRequest = new AddUserRequest("jeff", "deleon", "jeffdeleonbsk@gmail.com", "active", "ADMIN");
    const cmd = new AddUserCmd(cmdRequest, db, factory.create<AddUserResponse>());
    const cmdResult = await cmd.execute();
    genericHandleViewResult<AddUserRequest, AddUserResponse>(response, cmdRequest, cmdResult, "users/views/index", "layouts/layout2");
});

router.get("/test", async (request: Request, response: Response) => {

    const db = getInstance("UserDb");
    const factory: IExecutorFactory = getInstance("ExecutorFactory");
    const cmdRequest = new AddUserRequest("jeff2", "deleon2", "email@email.com", "active", "");
    const cmd = new AddUserCmd(cmdRequest, db, factory.create<AddUserResponse>());
    const cmdResult = await cmd.execute();
    genericHandleJsonResult<AddUserRequest, AddUserResponse>(response, cmdRequest, cmdResult);
});

router.get("/test-update", async (request: Request, res: Response) => {
    const factory: IExecutorFactory = getInstance("ExecutorFactory");
    const cmdRequest = new UpdateUserRequest("some", "thing", "else");
    const cmd = new UpdateUserCmd(cmdRequest, factory.create<UpdateUserResponse>());
    const cmdResult = await cmd.execute();
    genericHandleViewResult<UpdateUserRequest, UpdateUserResponse>(res, cmdRequest, cmdResult, "users/views/updateUser", "layouts/layout");
});
export default router;
