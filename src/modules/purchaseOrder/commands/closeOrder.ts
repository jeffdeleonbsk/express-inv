import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { ReceivingPurchaseOrder } from "../models/PurchaseOrderReceiving";

export class CloseOrderRequest {
    constructor(
        public receivingPurchaseOrderId: string,
        public date: Date,
        public comment: string
    ) {}
}

export class CloseOrderResponse {
    constructor(public receivingPurchaseOrderId: string) {}
}

export class CloseOrderCmd extends BaseCommand<CloseOrderRequest, CloseOrderResponse> {
    private db: IPurchaseOrderDb;
    constructor(req: CloseOrderRequest, db: IPurchaseOrderDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<CloseOrderResponse>> {
        const po = await this.db.getReceivingById(this.request.receivingPurchaseOrderId);
        if (!po) {
            return Result.appFailed("Receiving Purchase Order not found", "No receiving purchase order found with the given ID");
        }
        po.closeOrder(this.request.date, this.request.comment);
        await this.db.updateReceiving(po);
        return Result.Ok(new CloseOrderResponse(po.id));
    }
    protected getValidationRules(): any {
        return {
            receivingPurchaseOrderId: "required|string",
            date: "required|date",
            comment: "required|string"
        };
    }
}
