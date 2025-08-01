import { token } from "brandi";
import { IPurchaseOrderDb } from "../../modules/purchaseOrder/iPurchaseOrderDb";
import { IPurchaseOrderFacade } from "./IPurchaseOrderFacade";
import { IInventoryDb } from "../../modules/inventory/iInventoryDb";
import { IAddToInventoryService } from "../../modules/purchaseOrder/models/PurchaseOrderReceiving";

const poTokenMap = {
    purchaseOrderDb: token<IPurchaseOrderDb>("PurchaseOrderDb"),
    purchaseOrderFacade: token<IPurchaseOrderFacade>("PurchaseOrderFacade"),
    addToInventoryService: token<IAddToInventoryService>("AddToInventoryService"),
};
export default poTokenMap;
