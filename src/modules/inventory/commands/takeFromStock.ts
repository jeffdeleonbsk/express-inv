import { BaseCommand } from "../../common/baseCommand";
import { Result } from "../../common/result";
import { Quantity } from "../../domain/common/genericValueObjects";
import { IInventoryDb } from "../iInventoryDb";
import { InventoryEntry } from "../models/inventory";

export class TakeFromStockRequest {
    constructor(
        public productId: string,
        public warehouseId: string,
        public takenQuantity: number,
        public takenQuantityUnit: string
    ) {}
}

export class TakeFromStockResponse {
    constructor(
        public id: string,
        public remainingQuantity: number,
        public remainingQuantityUnit: string
    ) {}
}

export class TakeFromStockCmd extends BaseCommand<TakeFromStockRequest, TakeFromStockResponse> {
    private db: IInventoryDb;

    constructor(req: TakeFromStockRequest, db: IInventoryDb) {
        super(req);
        this.db = db;
    }

    public async doCommand(): Promise<Result<TakeFromStockResponse>> {
        const takenQuantity = new Quantity(this.request.takenQuantity, this.request.takenQuantityUnit);
        const entry = await this.db.getByProductandWarehouseId(
            this.request.productId, this.request.warehouseId
        );
        if (!entry) {
            return Result.appFailed("Inventory entry not found.");
        }

        entry.takeStock(takenQuantity);
        await this.db.update(entry);
        return Result.Ok(
            new TakeFromStockResponse(
                entry.id,
                entry.quantity.value,
                entry.quantity.unit
            )
        );
    }

    protected getValidationRules(): any {
        return {
            productId: "required|string",
            warehouseId: "required|string",
            takenQuantity: "required|numeric",
            takenQuantityUnit: "required|string"
        };
    }
}
