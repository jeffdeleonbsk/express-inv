import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { Quantity } from "../../domain/common/genericValueObjects";
import { IInventoryDb } from "../iInventoryDb";
import { InventoryEntry } from "../models/inventory";

export class AddToStockRequest {
    constructor(
        public productId: string,
        public warehouseId: string,
        public deliveredQuantity: number,
        public deliveredQuantityUnit: string
    ) {}
}

export class AddToStockResponse {
    constructor(public inventoryId: string) {}
}

export class AddToStockCmd extends BaseCommand<AddToStockRequest, AddToStockResponse> {
    private db: IInventoryDb;
    constructor(req: AddToStockRequest, db: IInventoryDb) {
        super(req);
        this.db = db;
    }
    public async doCommand(): Promise<Result<AddToStockResponse>> {
        const deliveredQuantity = new Quantity(this.request.deliveredQuantity, this.request.deliveredQuantityUnit);
        const entry = await this.db.getByProductandWarehouseId(
                this.request.productId, this.request.warehouseId
            );
        if (!entry) {
            const product = await this.db.getProductById(this.request.productId);
            const warehouse = await this.db.getWarehouseById(this.request.warehouseId);
            const addedEntry = InventoryEntry.createNew(product, warehouse, deliveredQuantity);
            await this.db.add(addedEntry);
            return Result.Ok(new AddToStockResponse(addedEntry.id));
        }
        entry.addStock(deliveredQuantity);
        await this.db.update(entry);
        return Result.Ok(new AddToStockResponse(entry.id));
    }
    protected getValidationRules(): any {
        return {
            productId: "required|string",
            warehouseId: "required|string",
            deliveredQuantity: "required|numeric",
            deliveredQuantityUnit: "required|string"
        };
    }
}
