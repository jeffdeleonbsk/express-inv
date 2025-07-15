import { IEventPublisher } from "../../../modules/common/IEventPublisher";
import { Quantity } from "../../../modules/domain/common/genericValueObjects";
import { PurchaseOrderDeliveredEvent } from "../../../modules/domain/events/purchaseOrderDeliveredEvent";
import { IAddToInventoryService } from "../../../modules/purchaseOrder/models/PurchaseOrderReceiving";
import { getInstance } from "../../common/diContainer";
import TokenMap from "../../common/tokenMap";

export class EventBasedInventoryAddService implements IAddToInventoryService {
    public async addStock(productId: string, warehouseId: string, deliveredQuantity: Quantity): Promise<void> {
        console.log("Adding stock to inventory:", productId, warehouseId, deliveredQuantity);
        const event = new PurchaseOrderDeliveredEvent(
            productId,
            warehouseId,
            deliveredQuantity
        );
        const eventPublisher = getInstance(TokenMap.eventPublisher) as IEventPublisher;
        eventPublisher.publish("PurchaseOrderDeliveredEvent", event);
    }
}
