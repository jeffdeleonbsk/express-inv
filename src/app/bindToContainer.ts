
import { container } from "./common/diContainer";
import TokenMap from "./common/tokenMap";
import { AuthService } from "./infrastructure/services/authService";
import { InventoryAddService } from "./infrastructure/services/InventoryAddService";
import { AuthDbSqlite } from "./infrastructure/sqlite/authDbSqlite";
import { EmailExistsService } from "./infrastructure/sqlite/EmailExistsService";
import { InventoryDbSqlite } from "./infrastructure/sqlite/InventoryDbSqlite";
import { PurchaseOrderDbSqlite } from "./infrastructure/sqlite/purchaseOrderDbSqlite";
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
    container
        .bind(TokenMap.purchaseOrderDb)
        .toInstance(PurchaseOrderDbSqlite)
        .inSingletonScope();
    container
        .bind(TokenMap.inventoryAddService)
        .toInstance(InventoryAddService)
        .inSingletonScope();
    container
        .bind(TokenMap.inventoryDb)
        .toInstance(InventoryDbSqlite)
        .inSingletonScope();
}
