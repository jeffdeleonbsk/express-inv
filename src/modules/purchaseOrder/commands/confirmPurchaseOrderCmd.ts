import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { PurchaseOrder } from "../models/PurchaseOrderCreation";

export class ConfirmPurchaseOrderRequest {
    constructor(
        public purchaseOrderId: string,
        public date: Date,
        public comment: string
    ) {}
}

export class ConfirmPurchaseOrderResponse {
    constructor(public purchaseOrderId: string) {}
}

export class ConfirmPurchaseOrderCmd extends BaseCommand<ConfirmPurchaseOrderRequest, ConfirmPurchaseOrderResponse> {
    private db: IPurchaseOrderDb;
    constructor(req: ConfirmPurchaseOrderRequest, db: IPurchaseOrderDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<ConfirmPurchaseOrderResponse>> {
        const po = await this.db.getPurchaseOrderById(this.request.purchaseOrderId);
        if (!po) {
            return Result.appFailed("Purchase Order not found", "No purchase order found with the given ID");
        }
        po.confirm(this.request.date, this.request.comment);
        await this.db.updatePO(po);
        return Result.Ok(new ConfirmPurchaseOrderResponse(po.id));
    }
    protected getValidationRules(): any {
        return {
            purchaseOrderId: "required|string",
            date: "required|date",
            comment: "required|string"
        };
    }
}
