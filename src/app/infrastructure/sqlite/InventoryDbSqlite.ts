import Database from "better-sqlite3";
import { IInventoryDb } from "../../../modules/inventory/iInventoryDb";
import { InventoryEntry } from "../../../modules/inventory/models/inventory";
import { Product, Warehouse } from "../../../modules/domain/common/domainValueObjects";

export class InventoryDbSqlite implements IInventoryDb {
    private db: any;
    constructor() {
        const dbName = process.env.SQLITE_DB;
        this.db = new Database(dbName);
        this.db.pragma("journal_mode = WAL");
    }

    public async getById(id: string): Promise<InventoryEntry | null> {
        const stmt = this.db.prepare(
            `SELECT id, product_id, warehouse_id, quantity, quantity_unit FROM inventory_items WHERE id = ?`
        );
        const row = stmt.get(id);
        if (!row) return null;
        const product = await this.getProductById(row.product_id);
        const warehouse = await this.getWarehouseById(row.warehouse_id);
        return InventoryEntry.fromDB({
            id: row.id,
            product: product!,
            warehouse: warehouse!,
            quantity: row.quantity
        });
    }

    public async add(item: InventoryEntry): Promise<string> {
        const stmt = this.db.prepare(
            `INSERT INTO inventory_items (id, product_id, warehouse_id, quantity, quantity_unit) VALUES (?, ?, ?, ?, ?)`
        );
        stmt.run(item.id, item.product.id, item.warehouse.id, item.quantity.value, item.quantity.unit || "pcs");
        return item.id;
    }

    public async update(item: InventoryEntry): Promise<number> {
        const stmt = this.db.prepare(
            `UPDATE inventory_items SET product_id = ?, warehouse_id = ?, quantity = ?, quantity_unit = ? WHERE id = ?`
        );
        const result = stmt.run(item.product.id, item.warehouse.id, item.quantity.value, item.quantity.unit || "pcs", item.id);
        return result.changes;
    }

    public async delete(id: string): Promise<number> {
        const stmt = this.db.prepare(
            `DELETE FROM inventory_items WHERE id = ?`
        );
        const result = stmt.run(id);
        return result.changes;
    }

    public async getProductById(id: string): Promise<Product | null> {
        const stmt = this.db.prepare(
            `SELECT id, sku, name, is_active, need_refrigeration FROM products WHERE id = ?`
        );
        const row = stmt.get(id);
        if (!row) return null;
        return Product.fromDb(row.id, row.sku, row.name, !!row.is_active, !!row.need_refrigeration);
    }

    public async getWarehouseById(id: string): Promise<Warehouse | null> {
        const stmt = this.db.prepare(
            `SELECT id, short_code, name, is_active, is_refrigerated FROM warehouses WHERE id = ?`
        );
        const row = stmt.get(id);
        if (!row) return null;
        return Warehouse.fromDb(row.id, row.short_code, row.name, !!row.is_active, !!row.is_refrigerated);
    }
}
