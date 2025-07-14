import Database from "better-sqlite3";
import { Product, Vendor, Warehouse } from "../../../modules/domain/common/commonEntities";
import { Money, Quantity } from "../../../modules/domain/common/genericValueObjects";
import { IPurchaseOrderDb } from "../../../modules/purchaseOrder/iPurchaseOrderDb";
import { PurchaseOrder, PurchaseOrderLineItem } from "../../../modules/purchaseOrder/models/PurchaseOrderCreation";
import { Delivery, ReceivingLineItem, ReceivingPurchaseOrder } from "../../../modules/purchaseOrder/models/PurchaseOrderReceiving";

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
    public async addPO(po: PurchaseOrder): Promise<number> {
        if (po.isNew === false) {
            return 0; // No changes to save
        }

        const stmt = this.db.prepare(
            `INSERT INTO purchase_orders (id, vendor_id, owner_id, status, date_created, date_confirmed, date_cancelled, date_delivered, date_closed, delivered_comment, cancelled_comment, closed_comment, confirmed_comment, created_comment)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        const params = [
            po.id,
            po.vendor.id,
            "",
            po.status,
            new Date().toISOString(),
            po.dateConfirmed ? po.dateConfirmed.toISOString() : null,
            po.dateCancelled ? po.dateCancelled.toISOString() : null,
            null, // dateDelivered
            null, // dateClosed
            null, // deliveredComment
            null, // cancelledComment
            null, // closedComment
            null, // confirmedComment
            po.comment || ""
        ];
        const result = stmt.run(...params);
        if (result.changes > 0) {
            // Save line items
            for (const item of po.lineItems) {
                await this.processLineItem(item, po.id);
            }
        }
        return result.changes;
    }
    public async processLineItem(lineItem: PurchaseOrderLineItem, poid: string): Promise<number> {
        if (lineItem.isDeleted === true) {
            const stmt = this.db.prepare(
                `DELETE FROM purchase_order_line_items WHERE id = ?`
            );
            const result = stmt.run(lineItem.id);
            return result.changes;
        }

        if (lineItem.isNew === true) {
            const stmt = this.db.prepare(
                `INSERT INTO purchase_order_line_items (id, purchase_order_id, product_id, warehouse_id, ordered_quantity, ordered_quantity_unit, unit_price, status, date_created)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            );
            const params = [
                lineItem.id,
                poid,
                lineItem.product.id,
                lineItem.warehouse.id,
                lineItem.orderedQuantity.value,
                lineItem.orderedQuantity.unit,
                lineItem.unitPrice.amount,
                lineItem.status,
                new Date().toISOString()
            ];
            const result = stmt.run(...params);
            return result.changes;
        }
        if (lineItem.isDirty === true) {
            // update the line item
            const stmt = this.db.prepare(
                `UPDATE purchase_order_line_items
                 SET product_id = ?, warehouse_id = ?, ordered_quantity = ?, ordered_quantity_unit = ?, unit_price = ?, status = ?,
                 date_confirmed = ?, date_cancelled = ?, confirmed_comment = ?, cancelled_comment = ?

                 WHERE id = ?`
            );
            const params = [
                lineItem.product.id,
                lineItem.warehouse.id,
                lineItem.orderedQuantity.value,
                lineItem.orderedQuantity.unit,
                lineItem.unitPrice.amount,
                lineItem.status,
                lineItem.dateConfirmed ? lineItem.dateConfirmed.toISOString() : null,
                lineItem.dateCancelled ? lineItem.dateCancelled.toISOString() : null,
                lineItem.confirmComment || "",
                lineItem.cancelComment || "",
                lineItem.id
            ];
            const result = stmt.run(...params);
            return result.changes;
        }

        return 0;
    }
    public async updatePO(po: PurchaseOrder): Promise<number> {
        for (const item of po.lineItems) {
            await this.processLineItem(item, po.id);
        }
        if (po.isDirty === false) {
            return 0; // No changes to save
        }
        const stmt = this.db.prepare(
            `UPDATE purchase_orders
             SET vendor_id = ?, owner_id = ?, status = ?, date_confirmed = ?, date_cancelled = ?, date_delivered = ?, date_closed = ?, delivered_comment = ?, cancelled_comment = ?, closed_comment = ?, confirmed_comment = ?, created_comment = ?
             WHERE id = ?`
        );
        const params = [
            po.vendor.id,
            "",
            po.status,
            po.dateConfirmed ? po.dateConfirmed.toISOString() : null,
            po.dateCancelled ? po.dateCancelled.toISOString() : null,
            null, // dateDelivered
            null, // dateClosed
            null, // deliveredComment
            po.cancelComment, // cancelledComment
            null, // closedComment
            po.confirmComment || "",
            po.comment || "",
            po.id
        ];
        const result = stmt.run(...params);
        return result.changes;
    }
    public async deletePO(id: string): Promise<number> {
        const stmt = this.db.prepare(
            `DELETE FROM purchase_orders WHERE id = ?`
        );
        const result = stmt.run(id);
        if (result.changes > 0) {
            // Also delete line items
            const lineItemStmt = this.db.prepare(
                `DELETE FROM purchase_order_line_items WHERE purchase_order_id = ?`
            );
            lineItemStmt.run(id);
        }
        return result.changes;
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
            dateConfirmed: poRow.date_confirmed ? new Date(poRow.date_confirmed) : undefined,
            dateDelivered: poRow.date_delivered ? new Date(poRow.date_delivered) : undefined,
            deliveredComment: poRow.delivered_comment,
            dateCancelled: poRow.date_cancelled ? new Date(poRow.date_cancelled) : undefined,
            cancelledComment: poRow.cancelled_comment,
            dateClosed: poRow.date_closed ? new Date(poRow.date_closed) : undefined,
            closedComment: poRow.closed_comment
        });
    }
    public async processDelivery(delivery: Delivery, lineItemId: string): Promise<number> {
        if (delivery.isDeleted === true) {
            const stmt = this.db.prepare(
                `DELETE FROM deliveries WHERE id = ?`
            );
            const result = stmt.run(delivery.id);
            return result.changes;
        }
        if (delivery.isNew === true) {
            const stmt = this.db.prepare(
                `INSERT INTO deliveries (id, line_item_id, date_delivered, delivery_comment, delivered_quantity, delivered_quantity_unit)
                 VALUES (?, ?, ?, ?, ?, ?)`
            );
            const params = [
                delivery.id,
                lineItemId,
                delivery.dateDelivered.toISOString(),
                delivery.deliveryComment || "",
                delivery.deliveredQuantity.value,
                delivery.deliveredQuantity.unit
            ];
            const result = stmt.run(...params);
            return result.changes;
        }
        if (delivery.isDirty === true) {
            const stmt = this.db.prepare(
                `UPDATE deliveries
                 SET date_delivered = ?, delivery_comment = ?, delivered_quantity = ?, delivered_quantity_unit = ?
                 WHERE id = ?`
            );
            const params = [
                delivery.dateDelivered.toISOString(),
                delivery.deliveryComment || "",
                delivery.deliveredQuantity.value,
                delivery.deliveredQuantity.unit,
                delivery.id
            ];
            const result = stmt.run(...params);
            return result.changes;
        }
        return 0;
    }
    public async processReceivingLineItem(lineItem: ReceivingLineItem, poid: string): Promise<number> {
        for (const delivery of lineItem.deliveries) {
            await this.processDelivery(delivery, lineItem.id);
        }
        if (lineItem.isDeleted === true) {
            const stmt = this.db.prepare(
                `DELETE FROM purchase_order_line_items WHERE id = ?`
            );
            const result = stmt.run(lineItem.id);
            return result.changes;
        }

        if (lineItem.isDirty === true) {
            // update the line item
            const stmt = this.db.prepare(
                `UPDATE purchase_order_line_items
                 SET product_id = ?, warehouse_id = ?, ordered_quantity = ?,
                 ordered_quantity_unit = ?, status = ?, date_cancelled = ?,
                 date_delivered = ?, delivered_comment = ?,
                 delivered_quantity = ?, delivered_quantity_unit = ?,
                 cancelled_comment = ?
                 WHERE id = ?`
            );
            const params = [
                lineItem.product.id,
                lineItem.warehouse.id,
                lineItem.orderedQuantity.value,
                lineItem.orderedQuantity.unit,
                lineItem.status,
                lineItem.dateCancelled ? lineItem.dateCancelled.toISOString() : null,
                lineItem.dateDelivered ? lineItem.dateDelivered.toISOString() : null,
                lineItem.deliveredComment || "",
                lineItem.deliveredQuantity.value,
                lineItem.deliveredQuantity.unit,
                lineItem.cancelledComment || "",
                lineItem.id
            ];
            const result = stmt.run(...params);
            return result.changes;
        }

        return 0;
    }

    public async updateReceiving(po: ReceivingPurchaseOrder): Promise<number> {
        for (const item of po.lineItems) {
            await this.processReceivingLineItem(item, po.id);
        }
        if (po.isDirty === false) {
            return 0; // No changes to save
        }
        const stmt = this.db.prepare(
            `UPDATE purchase_orders
             SET status = ?, date_confirmed = ?, date_cancelled = ?, date_delivered = ?, date_closed = ?, delivered_comment = ?, cancelled_comment = ?, closed_comment = ?
             WHERE id = ?`
        );
        const params = [
            po.status,
            po.dateConfirmed ? po.dateConfirmed.toISOString() : null,
            po.dateCancelled ? po.dateCancelled.toISOString() : null,
            po.dateDelivered ? po.dateDelivered.toISOString() : null,
            po.dateClosed ? po.dateClosed.toISOString() : null,
            po.deliveredComment || "",
            po.cancelledComment || "",
            po.closedComment || "",
            po.id
        ];
        const result = stmt.run(...params);
        return result.changes;
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
