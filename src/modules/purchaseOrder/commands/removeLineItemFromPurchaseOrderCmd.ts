import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { PurchaseOrder } from "../models/PurchaseOrderCreation";

export class RemoveLineItemFromPurchaseOrderRequest {
    constructor(
        public purchaseOrderId: string,
        public lineItemId: string
    ) {}
}

export class RemoveLineItemFromPurchaseOrderResponse {
    constructor(public purchaseOrderId: string) {}
}

export class RemoveLineItemFromPurchaseOrderCmd extends BaseCommand<RemoveLineItemFromPurchaseOrderRequest, RemoveLineItemFromPurchaseOrderResponse> {
    private db: IPurchaseOrderDb;
    constructor(req: RemoveLineItemFromPurchaseOrderRequest, db: IPurchaseOrderDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<RemoveLineItemFromPurchaseOrderResponse>> {
        const po = await this.db.getPurchaseOrderById(this.request.purchaseOrderId);
        if (!po) {
            return Result.appFailed("Purchase Order not found", "No purchase order found with the given ID");
        }
        po.removeLineItem(this.request.lineItemId);
        await this.db.updatePO(po);
        return Result.Ok(new RemoveLineItemFromPurchaseOrderResponse(po.id));
    }
    protected getValidationRules(): any {
        return {
            purchaseOrderId: "required|string",
            lineItemId: "required|string"
        };
    }
}
