import { IEventHandler } from "../../../modules/common/IEventSubscriber";
import { AddToStockCmd, AddToStockRequest } from "../../../modules/inventory/commands/addToStock";
import { getInstance } from "../../common/diContainer";
import TokenMap from "../../common/tokenMap";

export class PurchaseOrderDeliveredEventHandler implements IEventHandler {
    public getID(): string {
        return "PurchaseOrderDeliveredEventHandler";
    }
    public async handle<PurchaseOrderDeliveredEvent>(eventData: PurchaseOrderDeliveredEvent): Promise<void> {
        const { productId, warehouseId, deliveredQuantity } = eventData as any;
        const db = getInstance(TokenMap.inventoryDb);
        const cmdRequest = new AddToStockRequest(productId, warehouseId, deliveredQuantity.value, deliveredQuantity.unit);
        const cmd = new AddToStockCmd(cmdRequest, db);
        await cmd.execute();
    }
}
