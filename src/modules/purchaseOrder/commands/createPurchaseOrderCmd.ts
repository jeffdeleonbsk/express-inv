import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { PurchaseOrder} from "../models/PurchaseOrderCreation";
import { Vendor, Warehouse, Product } from "../models/valueObjects";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { Money, Quantity } from "../../domain/common/valueObjects";

export class CreatePurchaseOrderRequest {
    constructor(
        public vendorId: string,
        public date: Date,
        public comment: string | undefined

    ) {}
}

export class CreatePurchaseOrderResponse {
    static mapFromPO(po: PurchaseOrder): CreatePurchaseOrderResponse {
        return new CreatePurchaseOrderResponse(po.id);
    }
    constructor(public id: string) {}
}

export class CreatePurchaseOrderCmd extends BaseCommand<CreatePurchaseOrderRequest, CreatePurchaseOrderResponse> {
    private db: IPurchaseOrderDb;
    constructor(req: CreatePurchaseOrderRequest, db: IPurchaseOrderDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<CreatePurchaseOrderResponse>> {
        const vendor = await this.db.getVendorById(this.request.vendorId);
        const po = PurchaseOrder.createNew(vendor, this.request.date, this.request.comment);
        // Save to DB
        await this.db.addPO(po);
        return Result.Ok(CreatePurchaseOrderResponse.mapFromPO(po));

    }
    protected getValidationRules(): any {
        return {
            vendorId: "required",
            date: "required|date"
        };
    }
}
