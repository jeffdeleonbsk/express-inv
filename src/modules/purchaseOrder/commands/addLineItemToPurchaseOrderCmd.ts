import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { Money, Quantity } from "../../domain/common/genericValueObjects";
import { IPurchaseOrderDb } from "../iPurchaseOrderDb";
import { PurchaseOrder, PurchaseOrderLineItem } from "../models/PurchaseOrderCreation";

export class AddLineItemToPurchaseOrderRequest {
    constructor(
        public purchaseOrderId: string,
        public productId: string,
        public warehouseId: string,
        public orderedQuantity: number,
        public orderedQuantityUnit: string,
        public unitPrice: number,
        public unitPriceCurrency: string
    ) {}
}

export class AddLineItemToPurchaseOrderResponse {
    constructor(public purchaseOrderId: string) {}
}

export class AddLineItemToPurchaseOrderCmd extends BaseCommand<AddLineItemToPurchaseOrderRequest, AddLineItemToPurchaseOrderResponse> {
    private db: IPurchaseOrderDb;
    constructor(req: AddLineItemToPurchaseOrderRequest, db: IPurchaseOrderDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<AddLineItemToPurchaseOrderResponse>> {
        const po = await this.db.getPurchaseOrderById(this.request.purchaseOrderId);
        if (!po) {
            return Result.appFailed("Purchase Order not found", "No purchase order found with the given ID");
        }
        const product = await this.db.getProductById(this.request.productId);
        const warehouse = await this.db.getWarehouseById(this.request.warehouseId);
        const orderedQuantity = new Quantity(this.request.orderedQuantity, this.request.orderedQuantityUnit);
        const unitPrice = new Money(this.request.unitPrice, this.request.unitPriceCurrency);

        const lineItem = PurchaseOrderLineItem.createNew(
            product,
            warehouse,
            orderedQuantity,
            unitPrice
        );
        po.addLineItem(lineItem);
        await this.db.updatePO(po);
        return Result.Ok(new AddLineItemToPurchaseOrderResponse(po.id));
    }
    protected getValidationRules(): any {
        return {
            purchaseOrderId: "required|string",
            productId: "required|string",
            warehouseId: "required|string",
            orderedQuantity: "required|numeric",
            orderedQuantityUnit: "required|string",
            unitPrice: "required|numeric",
            unitPriceCurrency: "required|string"
        };
    }
}
