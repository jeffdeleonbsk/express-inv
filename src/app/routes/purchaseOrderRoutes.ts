import { Request, Response, Router } from "express";
import { getInstance } from "../common/diContainer";
import { authJwt } from "../middlewares/authMiddleware";
import poTokenMap from "../purchaseOrders/PoTokenMap";
import { IPurchaseOrderFacade } from "../purchaseOrders/IPurchaseOrderFacade";

const router = Router();
const getFacade = () : IPurchaseOrderFacade => {
    return getInstance(poTokenMap.purchaseOrderFacade) as IPurchaseOrderFacade;
}
router.post("/", authJwt, async (req: Request, res: Response) => {
    const { vendorId, date, comment, authUserId } = req.body;
    const ret = await getFacade().createPurchaseOrder(vendorId, new Date(Date.parse(date)), comment, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret);   
});

router.post("/add-line-item", authJwt, async (req: Request, res: Response) => {
    const { purchaseOrderId, productId, warehouseId, orderedQuantity, 
        orderedQuantityUnit, unitPrice, unitPriceCurrency, authUserId } = req.body;
    const ret = await getFacade().addLineItem(purchaseOrderId, productId, 
        warehouseId, orderedQuantity, orderedQuantityUnit, 
        unitPrice, unitPriceCurrency);
    res.status(ret.isSuccess ? 200 : 422).json(ret);       
});

router.post("/remove-line-item", authJwt, async (req: Request, res: Response) => {
    const { purchaseOrderId, lineItemId, authUserId } = req.body;
    const ret = await getFacade().removeLineItem(purchaseOrderId, lineItemId, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret);  
});

router.post("/cancel", authJwt, async (req: Request, res: Response) => {
    const { purchaseOrderId, date, comment, authUserId } = req.body;
    const ret = await getFacade().cancelDraftPO(purchaseOrderId, new Date(Date.parse(date)), comment, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret);   
});

router.post("/confirm", authJwt, async (req: Request, res: Response) => {
    const { purchaseOrderId, date, comment, authUserId } = req.body;
    const ret = await getFacade().confirmDraftPO(purchaseOrderId, new Date(Date.parse(date)), comment, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret); 
});

router.post("/receive-delivery", authJwt, async (req: Request, res: Response) => {
    const { receivingPurchaseOrderId, lineItemId, deliveredQuantity, 
        deliveredQuantityUnit, dateDelivered, deliveryComment, authUserId } = req.body;
    const ret = await getFacade().receiveDelivery(receivingPurchaseOrderId, lineItemId, 
        deliveredQuantity, deliveredQuantityUnit, new Date(Date.parse(dateDelivered)), 
        deliveryComment, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret);     
});

router.post("/cancel-confirmed", authJwt, async (req: Request, res: Response) => {
    const { receivingPurchaseOrderId, date, comment, authUserId } = req.body;
    const ret = await getFacade().cancelConfirmedPO(receivingPurchaseOrderId, new Date(Date.parse(date)), comment, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret); 
});

router.post("/close", authJwt, async (req: Request, res: Response) => {
    const { receivingPurchaseOrderId, date, comment, authUserId } = req.body;
    const ret = await getFacade().closePO(receivingPurchaseOrderId, new Date(Date.parse(date)), comment, authUserId);
    res.status(ret.isSuccess ? 200 : 422).json(ret); 
});
export default router;
