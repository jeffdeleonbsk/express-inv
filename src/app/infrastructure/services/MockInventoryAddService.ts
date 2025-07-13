import { Quantity } from "../../../modules/domain/common/genericValueObjects";
import { IAddToInventoryService } from "../../../modules/purchaseOrder/models/PurchaseOrderReceiving";

export class MockInventoryAddService implements IAddToInventoryService {
    public async addStock(productId: string, warehouseId: string, deliveredQuantity: Quantity): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
