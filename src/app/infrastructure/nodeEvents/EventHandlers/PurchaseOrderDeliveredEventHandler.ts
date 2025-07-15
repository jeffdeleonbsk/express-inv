import { IEventHandler } from "../../../../modules/common/IEventSubscriber";
import { AddToStockCmd, AddToStockRequest } from "../../../../modules/inventory/commands/addToStock";
import { getInstance } from "../../../common/diContainer";
import TokenMap from "../../../common/tokenMap";

export class PurchaseOrderDeliveredEventHandler implements IEventHandler {
    public getID(): string {
        return "PurchaseOrderDeliveredEvent";
    }
    public async handle<PurchaseOrderDeliveredEvent>(eventData: PurchaseOrderDeliveredEvent): Promise<void> {
        console.log("Purchase Order Delivered Event Handlerddd: ", eventData);
        const { productId, warehouseId, deliveredQuantity } = eventData as any; 
        const db = getInstance(TokenMap.inventoryDb);
        const cmdRequest = new AddToStockRequest(productId, warehouseId, deliveredQuantity.value, deliveredQuantity.unit);
        const cmd = new AddToStockCmd(cmdRequest, db);
        await cmd.execute();
    }
}
