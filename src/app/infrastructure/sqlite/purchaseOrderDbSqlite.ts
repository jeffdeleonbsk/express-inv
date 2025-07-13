import Database from "better-sqlite3";
import { Money, Quantity } from "../../../modules/domain/common/valueObjects";
import { IPurchaseOrderDb } from "../../../modules/purchaseOrder/iPurchaseOrderDb";
import { PurchaseOrder, PurchaseOrderLineItem } from "../../../modules/purchaseOrder/models/PurchaseOrderCreation";
import { Delivery, ReceivingLineItem, ReceivingPurchaseOrder } from "../../../modules/purchaseOrder/models/PurchaseOrderReceiving";
import { Product, Vendor, Warehouse } from "../../../modules/purchaseOrder/models/valueObjects";

export class PurchaseOrderDbSqlite implements IPurchaseOrderDb {
  private db: any;
  constructor() {
    const dbName = process.env.SQLITE_DB;
    this.db = new Database(dbName);
    this.db.pragma("journal_mode = WAL");
  }
    public async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
        // Get the purchase order
        const poStmt = this.db.prepare(
            `SELECT id, vendor_id, owner_id, status, date_created, date_confirmed, date_cancelled, date_delivered, date_closed, delivered_comment, cancelled_comment, closed_comment, confirmed_comment, created_comment
             FROM purchase_orders WHERE id = ?`
        );
        const poRow = poStmt.get(id);
        if (!poRow) { return null; }
        const lineItems = await this.getLineItemsByPOId(id);

        // Get vendor
        const vendor = await this.getVendorById(poRow.vendor_id);

        // Construct PurchaseOrder
        return PurchaseOrder.fromDb({
            id: poRow.id,
            vendor: vendor!,
            date: new Date(poRow.date_created),
            comment: poRow.created_comment,
            status: poRow.status,
            lineItems,
            confirmComment: poRow.confirmed_comment,
            cancelComment: poRow.cancelled_comment,
            dateConfirmed: poRow.date_confirmed ? new Date(poRow.date_confirmed) : undefined,
            dateCancelled: poRow.date_cancelled ? new Date(poRow.date_cancelled) : undefined
        });
    }
    public addPO(po: PurchaseOrder): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public updatePO(po: PurchaseOrder): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public deletePO(id: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public async getReceivingById(id: string): Promise<ReceivingPurchaseOrder | null> {
        // Get the purchase order
        const poStmt = this.db.prepare(
            `SELECT id, vendor_id, owner_id, status, date_created, date_confirmed, date_cancelled, date_delivered, date_closed, delivered_comment, cancelled_comment, closed_comment, confirmed_comment, created_comment
             FROM purchase_orders WHERE id = ?`
        );
        const poRow = poStmt.get(id);
        if (!poRow) { return null; }
        const lineItems = await this.getLineItemsByReceivingId(id);

        // Map to ReceivingPurchaseOrder
        return ReceivingPurchaseOrder.fromDB({
            id: poRow.id,
            status: poRow.status,
            lineItems,
            dateConfirmed: poRow.date_confirmed ? new Date(poRow.date_confirmed) : null,
            dateDelivered: poRow.date_delivered ? new Date(poRow.date_delivered) : undefined,
            deliveredComment: poRow.delivered_comment,
            dateCancelled: poRow.date_cancelled ? new Date(poRow.date_cancelled) : undefined,
            cancelledComment: poRow.cancelled_comment,
            dateClosed: poRow.date_closed ? new Date(poRow.date_closed) : undefined,
            closedComment: poRow.closed_comment
        });
    }
    public updateReceiving(po: ReceivingPurchaseOrder): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public async getVendorById(id: string): Promise<Vendor | null> {
        const stmt = this.db.prepare(
            "SELECT id, short_code, name, is_active FROM vendors WHERE id = ?"
        );
        const row = stmt.get(id);
        if (!row) { return null; }
        return Vendor.fromDb(row.id, row.short_code, row.name, !!row.is_active);
    }
    public async getWarehouseById(id: string): Promise<Warehouse | null> {
        const stmt = this.db.prepare(
            "SELECT id, short_code, name, is_active, is_refrigerated FROM warehouses WHERE id = ?"
        );
        const row = stmt.get(id);
        if (!row) { return null; }
        return Warehouse.fromDb(row.id, row.short_code, row.name, !!row.is_active, !!row.is_refrigerated);

    }
    public async getProductById(id: string): Promise<Product | null> {
        const stmt = this.db.prepare(
            "SELECT id, sku, name, is_active, need_refrigeration FROM products WHERE id = ?"
        );
        const row = stmt.get(id);
        if (!row) { return null; }
        return Product.fromDb(row.id, row.sku, row.name, !!row.is_active, !!row.need_refrigeration);
    }
    private async getDeliveriesByLineItemId(lineItemId: string): Promise<Delivery[]> {
        const stmt = this.db.prepare(
            `SELECT id, line_item_id, date_delivered, delivery_comment, delivered_quantity, delivered_quantity_unit
             FROM deliveries WHERE line_item_id = ?`
        );
        const rows = stmt.all(lineItemId);
        // You may want to map these rows to your Delivery domain model
        const deliveries = rows.map((row: any) => Delivery.fromDB({
            id: row.id,
            lineItemId: row.line_item_id,
            dateDelivered: new Date(row.date_delivered),
            deliveryComment: row.delivery_comment,
            deliveredQuantity: new Quantity(row.delivered_quantity, row.delivered_quantity_unit)
        }));
        return deliveries;
    }

    private async getLineItemsByReceivingId(poId: string): Promise<ReceivingLineItem[]> {
        const stmt = this.db.prepare(
            `SELECT id, product_id, warehouse_id, ordered_quantity, ordered_quantity_unit, status, delivered_quantity, delivered_quantity_unit, date_created, date_confirmed, date_cancelled, date_delivered, date_closed, delivered_comment, cancelled_comment, closed_comment, confirmed_comment
             FROM purchase_order_line_items WHERE purchase_order_id = ?`
        );
        const rows = stmt.all(poId);
        // Map each row to a PurchaseOrderLineItem (requires getProductById and getWarehouseByCode)
        const items = await Promise.all(rows.map(async (row: any) => {
            const product = await this.getProductById(row.product_id);
            const warehouse = await this.getWarehouseById(row.warehouse_id);
            const deliveries = await this.getDeliveriesByLineItemId(row.id);
            return ReceivingLineItem.fromDB({
                id: row.id,
                product: product!,
                warehouse: warehouse!,
                orderedQuantity: new Quantity(row.ordered_quantity, row.ordered_quantity_unit),
                status: row.status,
                deliveredQuantity: new Quantity(row.delivered_quantity, row.delivered_quantity_unit),
                deliveries,
                dateDelivered: row.date_delivered ? new Date(row.date_delivered) : undefined,
                deliveredComment: row.delivered_comment,
                dateCancelled: row.date_cancelled ? new Date(row.date_cancelled) : undefined,
                cancelledComment: row.cancelled_comment
             });

        }));
        return items;
    }

    private async getLineItemsByPOId(poId: string): Promise<PurchaseOrderLineItem[]> {
        const stmt = this.db.prepare(
            `SELECT id, product_id, warehouse_id, ordered_quantity, ordered_quantity_unit, status, delivered_quantity, delivered_quantity_unit, date_created, date_confirmed, date_cancelled, date_delivered, date_closed, delivered_comment, cancelled_comment, closed_comment, confirmed_comment
             FROM purchase_order_line_items WHERE purchase_order_id = ?`
        );
        const rows = stmt.all(poId);
        // Map each row to a PurchaseOrderLineItem (requires getProductById and getWarehouseByCode)
        const items = await Promise.all(rows.map(async (row: any) => {
            const product = await this.getProductById(row.product_id);
            const warehouse = await this.getWarehouseById(row.warehouse_id);
            return PurchaseOrderLineItem.fromDB({
                id: row.id,
                product: product!,
                warehouse: warehouse!,
                orderedQuantity: new Quantity(row.ordered_quantity, row.ordered_quantity_unit),
                unitPrice: new Money(0, "PhP"),
                status: row.status,
                confirmComment: row.confirmed_comment,
                cancelComment: row.cancelled_comment,
                dateConfirmed: row.date_confirmed ? new Date(row.date_confirmed) : undefined,
                dateCancelled: row.date_cancelled ? new Date(row.date_cancelled) : undefined
            });
        }));
        return items;
    }

}
