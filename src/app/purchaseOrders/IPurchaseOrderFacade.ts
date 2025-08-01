import { Result } from "../../modules/common/result";
import { AddLineItemToPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd";
import { CancelConfirmedOrderResponse } from "../../modules/purchaseOrder/commands/cancelConfirmedOrder";
import { CancelPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/cancelPurchaseOrderCmd";
import { CloseOrderResponse } from "../../modules/purchaseOrder/commands/closeOrder";
import { ConfirmPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/confirmPurchaseOrderCmd";
import { CreatePurchaseOrderResponse } from "../../modules/purchaseOrder/commands/createPurchaseOrderCmd";
import { ReceiveDeliveryResponse } from "../../modules/purchaseOrder/commands/receiveDelivery";
import { RemoveLineItemFromPurchaseOrderResponse } from "../../modules/purchaseOrder/commands/removeLineItemFromPurchaseOrderCmd";


export interface IPurchaseOrderFacade{
    createPurchaseOrder(vendorId:string, date:Date, comment:string, authUserId:string) 
        : Promise<Result<CreatePurchaseOrderResponse>>;

    addLineItem(purchaseOrderId:string, productId:string, 
            warehouseId:string, orderedQuantity:number, orderedQuantityUnit:string, 
            unitPrice:number, unitPriceCurrency:string) 
        : Promise<Result<AddLineItemToPurchaseOrderResponse>>;

    removeLineItem(purchaseOrderId:string, lineItemId:string, authUserId:string) 
        : Promise<Result<RemoveLineItemFromPurchaseOrderResponse>>;   
        
    cancelDraftPO(purchaseOrderId:string, date:Date, comment:string, authUserId:string) 
        : Promise<Result<CancelPurchaseOrderResponse>>;

    confirmDraftPO(purchaseOrderId:string, date:Date, comment:string, authUserId:string) 
        : Promise<Result<ConfirmPurchaseOrderResponse>>;

    cancelConfirmedPO(receivingPurchaseOrderId:string, date:Date, comment:string, authUserId:string) 
        : Promise<Result<CancelConfirmedOrderResponse>>;

    closePO(receivingPurchaseOrderId:string, date:Date, comment:string, authUserId:string) 
        : Promise<Result<CloseOrderResponse>>;

    receiveDelivery(receivingPurchaseOrderId: string, lineItemId:string, 
            deliveredQuantity:number, deliveredQuantityUnit:string, 
            dateDelivered:Date, deliveryComment:string, authUserId:string) 
        : Promise<Result<ReceiveDeliveryResponse>>
}