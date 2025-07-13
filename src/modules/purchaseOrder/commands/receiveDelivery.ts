import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { Quantity } from "../../domain/common/genericValueObjects";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { Delivery, IAddToInventoryService, ReceivingPurchaseOrder } from "../models/PurchaseOrderReceiving";

export class ReceiveDeliveryRequest {
    constructor(
        public receivingPurchaseOrderId: string,
        public lineItemId: string,
        public deliveredQuantity: number,
        public deliveredQuantityUnit: string,
        public dateDelivered: Date,
        public deliveryComment: string
    ) {}
}

export class ReceiveDeliveryResponse {
    constructor(public receivingPurchaseOrderId: string) {}
}

export class ReceiveDeliveryCmd extends BaseCommand<ReceiveDeliveryRequest, ReceiveDeliveryResponse> {
    private db: IPurchaseOrderDb;
    private inventory: IAddToInventoryService;
    constructor(req: ReceiveDeliveryRequest, db: IPurchaseOrderDb, inventory: IAddToInventoryService) {
        super(req);
        this.db = db;
        this.inventory = inventory;
    }
    public async doCommand(): Promise<Result<ReceiveDeliveryResponse>> {
        const po = await this.db.getReceivingById(this.request.receivingPurchaseOrderId);
        if (!po) {
            return Result.appFailed("Receiving Purchase Order not found", "No receiving purchase order found with the given ID");
        }
        const deliveredQuantity = new Quantity(this.request.deliveredQuantity, this.request.deliveredQuantityUnit);
        const delivery = Delivery.createNew(
            this.request.lineItemId,
            this.request.dateDelivered,
            this.request.deliveryComment,
            deliveredQuantity
        );

        po.receiveDelivery(this.request.lineItemId, delivery, this.inventory);

        await this.db.updateReceiving(po);
        return Result.Ok(new ReceiveDeliveryResponse(po.id));
    }
    protected getValidationRules(): any {
        return {
            receivingPurchaseOrderId: "required|string",
            lineItemId: "required|string",
            deliveredQuantity: "required|numeric",
            deliveredQuantityUnit: "required|string",
            dateDelivered: "required|date",
            deliveryComment: "string"
        };
    }
}
