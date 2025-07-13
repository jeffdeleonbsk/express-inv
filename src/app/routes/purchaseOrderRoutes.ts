import { Router, Request, Response, NextFunction } from "express";
import { getInstance } from "../common/diContainer";
import TokenMap from "../common/tokenMap";
import { Result } from "../../modules/common/result";
// Import all command classes and requests
import { CreatePurchaseOrderCmd, CreatePurchaseOrderRequest } from "../../modules/purchaseOrder/commands/createPurchaseOrderCmd";
import { AddLineItemToPurchaseOrderCmd, AddLineItemToPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd";
import { RemoveLineItemFromPurchaseOrderCmd, RemoveLineItemFromPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/removeLineItemFromPurchaseOrderCmd";
import { CancelPurchaseOrderCmd, CancelPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/cancelPurchaseOrderCmd";
import { ConfirmPurchaseOrderCmd, ConfirmPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/confirmPurchaseOrderCmd";
import { ReceiveDeliveryCmd, ReceiveDeliveryRequest } from "../../modules/purchaseOrder/commands/receiveDelivery";

import { CancelConfirmedOrderCmd, CancelConfirmedOrderRequest } from "../../modules/purchaseOrder/commands/cancelConfirmedOrder";
import { CloseOrderCmd, CloseOrderRequest } from "../../modules/purchaseOrder/commands/closeOrder";

const router = Router();
const authAdmin = async (request: Request, response: Response, next: NextFunction) => {
    // You may want to reuse or adjust your existing auth middleware
    next();
};

router.post("/", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { vendorId, date, comment } = req.body;
    const cmdRequest = new CreatePurchaseOrderRequest(vendorId, date, comment);
    const cmd = new CreatePurchaseOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});

router.post("/add-line-item", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { purchaseOrderId, productId, warehouseId, orderedQuantity, orderedQuantityUnit, unitPrice, unitPriceCurrency } = req.body;
    const cmdRequest = new AddLineItemToPurchaseOrderRequest(purchaseOrderId, productId, warehouseId, orderedQuantity, orderedQuantityUnit, unitPrice, unitPriceCurrency);
    const cmd = new AddLineItemToPurchaseOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});

router.post("/remove-line-item", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { purchaseOrderId, lineItemId } = req.body;
    const cmdRequest = new RemoveLineItemFromPurchaseOrderRequest(purchaseOrderId, lineItemId);
    const cmd = new RemoveLineItemFromPurchaseOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});

router.post("/cancel", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { purchaseOrderId, date, comment } = req.body;
    const cmdRequest = new CancelPurchaseOrderRequest(purchaseOrderId, new Date(Date.parse(date)), comment);
    const cmd = new CancelPurchaseOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});

router.post("/confirm", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { purchaseOrderId, date, comment } = req.body;
    const cmdRequest = new ConfirmPurchaseOrderRequest(purchaseOrderId, new Date(Date.parse(date)), comment);
    const cmd = new ConfirmPurchaseOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});

router.post("/receive-delivery", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const inventory = getInstance(TokenMap.inventoryAddService); // You must have this in your DI
    const { receivingPurchaseOrderId, lineItemId, deliveredQuantity, deliveredQuantityUnit, dateDelivered, deliveryComment } = req.body;
    const cmdRequest = new ReceiveDeliveryRequest(receivingPurchaseOrderId, lineItemId, deliveredQuantity, deliveredQuantityUnit, 
        new Date(Date.parse(dateDelivered)), deliveryComment);
    const cmd = new ReceiveDeliveryCmd(cmdRequest, db, inventory);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});

router.post("/cancel-confirmed", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { receivingPurchaseOrderId, date, comment } = req.body;
    const cmdRequest = new CancelConfirmedOrderRequest(receivingPurchaseOrderId, new Date(Date.parse(date)), comment);
    const cmd = new CancelConfirmedOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});


router.post("/close", authAdmin, async (req: Request, res: Response) => {
    const db = getInstance(TokenMap.purchaseOrderDb);
    const { receivingPurchaseOrderId, date, comment } = req.body;
    const cmdRequest = new CloseOrderRequest(receivingPurchaseOrderId, new Date(Date.parse(date)), comment);
    const cmd = new CloseOrderCmd(cmdRequest, db);
    const result = await cmd.execute();
    res.status(result.isSuccess ? 200 : 422).json(result);
});
export default router;