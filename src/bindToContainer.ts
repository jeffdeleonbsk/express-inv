
import { token } from "brandi";
import { container, TOKEN_MAP } from "./modules/common/diContainer";
import { IUserDb } from "./modules/users/iUserDb";
import { UserDbSqlite } from "./modules/infraSqlite/userDbSqlite";
import { IEmailExistsService } from "./modules/users/domain/iEmailExistsService";
import { EmailExistsService } from "./modules/infraSqlite/EmailExistsService";
export function bindToContainer() {
    console.log("Binding in container");

    TOKEN_MAP.set("UserDb", token<IUserDb>("UserDb"));

    container
        .bind(TOKEN_MAP.get("UserDb"))
        .toInstance(UserDbSqlite)
        .inSingletonScope();
    TOKEN_MAP.set("EmailExistsService", token<IEmailExistsService>("EmailExistsService"));
    container
        .bind(TOKEN_MAP.get("EmailExistsService"))
        .toInstance(EmailExistsService)
        .inSingletonScope();        

}
