import { NextFunction, Request, Response, Router } from "express";
import { Result } from "../../modules/common/result";
import { AddLineItemToPurchaseOrderCmd, AddLineItemToPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd";
import { CancelConfirmedOrderCmd, CancelConfirmedOrderRequest } from "../../modules/purchaseOrder/commands/cancelConfirmedOrder";
import { CancelPurchaseOrderCmd, CancelPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/cancelPurchaseOrderCmd";
import { CloseOrderCmd, CloseOrderRequest } from "../../modules/purchaseOrder/commands/closeOrder";
import { ConfirmPurchaseOrderCmd, ConfirmPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/confirmPurchaseOrderCmd";
// Import all command classes and requests
import { CreatePurchaseOrderCmd, CreatePurchaseOrderRequest } from "../../modules/purchaseOrder/commands/createPurchaseOrderCmd";
import { ReceiveDeliveryCmd, ReceiveDeliveryRequest } from "../../modules/purchaseOrder/commands/receiveDelivery";
import { RemoveLineItemFromPurchaseOrderCmd, RemoveLineItemFromPurchaseOrderRequest } from "../../modules/purchaseOrder/commands/removeLineItemFromPurchaseOrderCmd";
import { getInstance } from "../common/diContainer";
import TokenMap from "../common/tokenMap";
import { authAdmin } from "../middlewares/authAdmin";
const router = Router();

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
