import { Quantity } from "../../../modules/domain/common/genericValueObjects";
import { AddToStockCmd, AddToStockRequest } from "../../../modules/inventory/commands/addToStock";
import { IAddToInventoryService } from "../../../modules/purchaseOrder/models/PurchaseOrderReceiving";
import { getInstance } from "../../common/diContainer";
import TokenMap from "../../common/tokenMap";

export class InventoryAddService implements IAddToInventoryService {
    public async addStock(productId: string, warehouseId: string, deliveredQuantity: Quantity): Promise<void> {
        const db = getInstance(TokenMap.inventoryDb);
        const cmdRequest = new AddToStockRequest(productId, warehouseId, deliveredQuantity.value, deliveredQuantity.unit);
        const cmd = new AddToStockCmd(cmdRequest, db);
        await cmd.execute();
    }
}
