
import { token } from "brandi";
import { DefaultExecutorFactory } from "./modules/common/DefaultExecutor";
import { container, TOKEN_MAP } from "./modules/common/diContainer";
import { IExecutorFactory } from "./modules/common/executor";
import { IUserDb } from "./modules/domain/users/iUserDb";
import { UserDbSqlite } from "./modules/infraSqlite/userDbSqlite";
export function bindToContainer() {
    console.log("Binding in container");

    TOKEN_MAP.set("UserDb", token<IUserDb>("UserDb"));

    container
        .bind(TOKEN_MAP.get("UserDb"))
        .toInstance(UserDbSqlite)
        .inSingletonScope();
    TOKEN_MAP.set("ExecutorFactory", token<IExecutorFactory>("ExecutorFactory"));
    container
        .bind(TOKEN_MAP.get("ExecutorFactory"))
        .toInstance(DefaultExecutorFactory)
        .inTransientScope();

}
