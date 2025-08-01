
import { container } from "./common/diContainer";
import TokenMap from "./common/tokenMap";
import { EventPublisher } from "./infrastructure/nodeEvents/EventPublisher";
import { EventSubscriber } from "./infrastructure/nodeEvents/EventSubscriber";
import { RabbitEventPublisher } from "./infrastructure/rabbit/RabbitEventPublisher";
import { RabbitEventSubscriber } from "./infrastructure/rabbit/RabbitEventSubscriber";
import { AuthService } from "./infrastructure/services/authService";
import { EventBasedInventoryAddService } from "./purchaseOrders/infrastructure/EventBasedInventoryAddService";
import { InventoryAddService } from "./purchaseOrders/infrastructure/InventoryAddService";
import { UserAccessService } from "./infrastructure/services/UserAccessService";
import { AuthDbSqlite } from "./infrastructure/sqlite/authDbSqlite";
import { AuthorizationDbSqlite } from "./infrastructure/sqlite/AuthorizationDbSqlite";
import { EmailExistsService } from "./infrastructure/sqlite/EmailExistsService";
import { InventoryDbSqlite } from "./infrastructure/sqlite/InventoryDbSqlite";
import { UserDbSqlite } from "./infrastructure/sqlite/userDbSqlite";

import { bindToContainerPO } from "./purchaseOrders/bindToContainerPO";

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
        .bind(TokenMap.authorizationDb)
        .toInstance(AuthorizationDbSqlite)
        .inSingletonScope();
    container
        .bind(TokenMap.authDb)
        .toInstance(AuthDbSqlite)
        .inSingletonScope();

    container
        .bind(TokenMap.inventoryAddService)
        .toInstance(EventBasedInventoryAddService)
        .inSingletonScope();
    container
        .bind(TokenMap.inventoryDb)
        .toInstance(InventoryDbSqlite)
        .inSingletonScope();
    container
        .bind(TokenMap.localEventSubscriber)
        .toInstance(EventSubscriber)
        .inSingletonScope();
    container
        .bind(TokenMap.localEventPublisher)
        .toInstance(EventPublisher)
        .inSingletonScope();

    container
        .bind(TokenMap.remoteEventSubscriber)
        .toInstance(RabbitEventSubscriber)
        .inSingletonScope();
    container
        .bind(TokenMap.remoteEventPublisher)
        .toInstance(RabbitEventPublisher)
        .inSingletonScope();
    container
        .bind(TokenMap.userAccessService)
        .toInstance(UserAccessService)
        .inSingletonScope();

    bindToContainerPO();    
}
