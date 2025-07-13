import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { ReceivingPurchaseOrder } from "../models/PurchaseOrderReceiving";

export class CancelConfirmedOrderRequest {
    constructor(
        public receivingPurchaseOrderId: string,
        public date: Date,
        public comment: string
    ) {}
}

export class CancelConfirmedOrderResponse {
    constructor(public receivingPurchaseOrderId: string) {}
}

export class CancelConfirmedOrderCmd extends BaseCommand<CancelConfirmedOrderRequest, CancelConfirmedOrderResponse> {
    private db: IPurchaseOrderDb;
    constructor(req: CancelConfirmedOrderRequest, db: IPurchaseOrderDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<CancelConfirmedOrderResponse>> {
        const po = await this.db.getReceivingById(this.request.receivingPurchaseOrderId);
        if (!po) {
            return Result.appFailed("Receiving Purchase Order not found", "No receiving purchase order found with the given ID");
        }
        po.cancelOrder(this.request.date, this.request.comment);
        await this.db.updateReceiving(po);
        return Result.Ok(new CancelConfirmedOrderResponse(po.id));
    }
    protected getValidationRules(): any {
        return {
            receivingPurchaseOrderId: "required|string",
            date: "required|date",
            comment: "required|string"
        };
    }
}
