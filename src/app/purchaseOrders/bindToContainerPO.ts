
import { container } from "../common/diContainer";
import { PurchaseOrderFacade } from "./PurchaseOrderFacade";
import { EventBasedInventoryAddService } from "./infrastructure/EventBasedInventoryAddService";

import poTokenMap from "./PoTokenMap";
import { PurchaseOrderDbSqlite } from "./infrastructure/PurchaseOrderDbSqlite";

export function bindToContainerPO() {
    console.log("Binding in container");
    container
        .bind(poTokenMap.purchaseOrderDb)
        .toInstance(PurchaseOrderDbSqlite)
        .inSingletonScope();
    container
        .bind(poTokenMap.purchaseOrderFacade)
        .toInstance(PurchaseOrderFacade)
        .inSingletonScope();
    container
        .bind(poTokenMap.addToInventoryService)
        .toInstance(EventBasedInventoryAddService)
        .inSingletonScope();
}
