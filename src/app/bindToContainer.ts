
import { container } from "./common/diContainer";
import TokenMap from "./common/tokenMap";
import { AuthService } from "./infrastructure/jwt/authService";
import { AuthDbSqlite } from "./infrastructure/sqlite/authDbSqlite";
import { EmailExistsService } from "./infrastructure/sqlite/EmailExistsService";
import { UserDbSqlite } from "./infrastructure/sqlite/userDbSqlite";

export function bindToContainer() {
    console.log("Binding in container");
    container
        .bind(TokenMap.userDb)
        .toInstance(UserDbSqlite)
        .inSingletonScope();
    container
        .bind(TokenMap.emailExistsService)
        .toInstance(EmailExistsService)
        .inSingletonScope();
    container
        .bind(TokenMap.authService)
        .toInstance(AuthService)
        .inSingletonScope();
    container
        .bind(TokenMap.authDb)
        .toInstance(AuthDbSqlite)
        .inSingletonScope();

}
