import { getInstance } from "../common/diContainer";
import poTokenMap from "./PoTokenMap";


// Import all command classes and requests
import { AddLineItemToPurchaseOrderCmd, AddLineItemToPurchaseOrderRequest, AddLineItemToPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd";
import { CancelConfirmedOrderCmd, CancelConfirmedOrderRequest, CancelConfirmedOrderResponse } from "../../modules/purchaseOrder/commands/cancelConfirmedOrder";
import { CancelPurchaseOrderCmd, CancelPurchaseOrderRequest, CancelPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/cancelPurchaseOrderCmd";
import { CloseOrderCmd, CloseOrderRequest, CloseOrderResponse } from "../../modules/purchaseOrder/commands/closeOrder";
import { ConfirmPurchaseOrderCmd, ConfirmPurchaseOrderRequest, ConfirmPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/confirmPurchaseOrderCmd";
import { CreatePurchaseOrderCmd, CreatePurchaseOrderRequest, CreatePurchaseOrderResponse } from "../../modules/purchaseOrder/commands/createPurchaseOrderCmd";
import { ReceiveDeliveryCmd, ReceiveDeliveryRequest, ReceiveDeliveryResponse } from "../../modules/purchaseOrder/commands/receiveDelivery";
import { RemoveLineItemFromPurchaseOrderCmd, RemoveLineItemFromPurchaseOrderRequest,RemoveLineItemFromPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/removeLineItemFromPurchaseOrderCmd";
import { IPurchaseOrderDb } from "../../modules/purchaseOrder/iPurchaseOrderDb";
import { Result } from "../../modules/common/result";
import { IPurchaseOrderFacade } from "./IPurchaseOrderFacade";


export class PurchaseOrderFacade implements IPurchaseOrderFacade{
    private db: IPurchaseOrderDb;
    constructor() {
        this.db = getInstance(poTokenMap.purchaseOrderDb) as IPurchaseOrderDb;;
    }
    async createPurchaseOrder(vendorId:string, date:Date, comment:string, authUserId:string) 
    : Promise<Result<CreatePurchaseOrderResponse>> {
        const cmdRequest = new CreatePurchaseOrderRequest(vendorId, date, comment, authUserId);
        const cmd = new CreatePurchaseOrderCmd(cmdRequest, this.db);       
        return await cmd.execute();
    }
    async addLineItem(purchaseOrderId:string, productId:string, 
        warehouseId:string, orderedQuantity:number, orderedQuantityUnit:string, 
        unitPrice:number, unitPriceCurrency:string) 
    : Promise<Result<AddLineItemToPurchaseOrderResponse>> {
        const cmdRequest = new AddLineItemToPurchaseOrderRequest(purchaseOrderId, productId, 
            warehouseId, orderedQuantity, orderedQuantityUnit, 
            unitPrice, unitPriceCurrency);
        const cmd = new AddLineItemToPurchaseOrderCmd(cmdRequest, this.db);
        return await cmd.execute();
    }
    async removeLineItem(purchaseOrderId:string, lineItemId:string, authUserId:string) 
    : Promise<Result<RemoveLineItemFromPurchaseOrderResponse>> {
        const cmdRequest = new RemoveLineItemFromPurchaseOrderRequest(purchaseOrderId, lineItemId);
        const cmd = new RemoveLineItemFromPurchaseOrderCmd(cmdRequest, this.db);       
        return await cmd.execute();
    }
    async cancelDraftPO(purchaseOrderId:string, date:Date, comment:string, authUserId:string) 
    : Promise<Result<CancelPurchaseOrderResponse>> {
        const cmdRequest = new CancelPurchaseOrderRequest(purchaseOrderId, date, comment);
        const cmd = new CancelPurchaseOrderCmd(cmdRequest, this.db);       
        return await cmd.execute();
    }
    async confirmDraftPO(purchaseOrderId:string, date:Date, comment:string, authUserId:string) 
    : Promise<Result<ConfirmPurchaseOrderResponse>> {
        const cmdRequest = new ConfirmPurchaseOrderRequest(purchaseOrderId, date, comment);
        const cmd = new ConfirmPurchaseOrderCmd(cmdRequest, this.db);       
        return await cmd.execute();
    }    
    async cancelConfirmedPO(receivingPurchaseOrderId:string, date:Date, comment:string, authUserId:string) 
    : Promise<Result<CancelConfirmedOrderResponse>> {
        const cmdRequest = new CancelConfirmedOrderRequest(receivingPurchaseOrderId, date, comment);
        const cmd = new CancelConfirmedOrderCmd(cmdRequest, this.db);       
        return await cmd.execute();
    }     
    async closePO(receivingPurchaseOrderId:string, date:Date, comment:string, authUserId:string) 
    : Promise<Result<CloseOrderResponse>> {
        const cmdRequest = new CloseOrderRequest(receivingPurchaseOrderId, date, comment);
        const cmd = new CloseOrderCmd(cmdRequest, this.db);       
        return await cmd.execute();
    }  
    async receiveDelivery(receivingPurchaseOrderId: string, lineItemId:string, 
        deliveredQuantity:number, deliveredQuantityUnit:string, 
        dateDelivered:Date, deliveryComment:string, authUserId:string) 
    : Promise<Result<ReceiveDeliveryResponse>> {
        const inventory = getInstance(poTokenMap.addToInventoryService); 
        const cmdRequest = new ReceiveDeliveryRequest(receivingPurchaseOrderId, lineItemId, 
            deliveredQuantity, deliveredQuantityUnit,
            dateDelivered, deliveryComment);
        const cmd = new ReceiveDeliveryCmd(cmdRequest, this.db, inventory);       
        return await cmd.execute();
    }        
}
