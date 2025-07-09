// purchase-order.spec.ts
import { LineItemStatus, PurchaseOrderStatus } from "../modules/domain/common/enums";
import { PurchaseOrder, PurchaseOrderLineItem } from "../modules/domain/purchaseOrder/PurchaseOrderCreation";
import { Product, Vendor, Warehouse } from "../modules/domain/purchaseOrder/PurchaseOrderCreation";

describe("PurchaseOrder domain model", () => {
  const vendor = new Vendor("v1", "V001", "Test Vendor", true);
  const refrigeratedWarehouse = new Warehouse("w1", "WHR1", "Cold Storage", true, true);
  const regularWarehouse = new Warehouse("w2", "WH2", "Dry Storage", true, false);
  const frozenFish = new Product("p1", "SKU1", "Frozen Fish", true, true);
  const rice = new Product("p2", "SKU2", "Rice", true, false);

  it("should create a DRAFT purchase order", () => {
    const po = new PurchaseOrder(vendor, new Date(), "Urgent");
    expect(po.status).toBe(PurchaseOrderStatus.DRAFT);
    expect(po.lineItems.length).toBe(0);
  });

  it("should add a line item with correct warehouse-product match", () => {
    const po = new PurchaseOrder(vendor, new Date());
    const item = new PurchaseOrderLineItem(frozenFish, refrigeratedWarehouse, 10, 200);
    po.addLineItem(item);
    expect(po.lineItems.length).toBe(1);
    expect(item.status).toBe(LineItemStatus.DRAFT);
  });

  it("should throw error if product refrigeration doesn't match warehouse", () => {
    let poli = null;
    expect(() => {
      poli = new PurchaseOrderLineItem(frozenFish, regularWarehouse, 5, 100);
    }).toThrow("Product refrigeration requirement does not match warehouse capability.");
    expect(poli).toBeNull();
  });

  it("should allow update of warehouse, quantity, and price in DRAFT status", () => {
    const item = new PurchaseOrderLineItem(rice, regularWarehouse, 10, 50);
    const newWarehouse = new Warehouse("w3", "WH3", "Dry 2", true, false);
    item.updateWarehouse(newWarehouse);
    item.updateOrderedQuantity(20);
    item.updateUnitPrice(45);
    expect(item.warehouse).toBe(newWarehouse);
    expect(item.orderedQuantity).toBe(20);
    expect(item.unitPrice).toBe(45);
  });

  it("should confirm a DRAFT purchase order with all DRAFT line items", () => {
    const po = new PurchaseOrder(vendor, new Date());
    const item1 = new PurchaseOrderLineItem(rice, regularWarehouse, 5, 10);
    const item2 = new PurchaseOrderLineItem(rice, regularWarehouse, 10, 12);
    po.addLineItem(item1);
    po.addLineItem(item2);
    po.confirm(new Date(), "Ready to process");
    expect(po.status).toBe(PurchaseOrderStatus.CONFIRMED);
    expect(item1.status).toBe(LineItemStatus.CONFIRMED);
    expect(item2.status).toBe(LineItemStatus.CONFIRMED);
  });

  it("should cancel a DRAFT purchase order with all DRAFT line items", () => {
    const po = new PurchaseOrder(vendor, new Date());
    const item = new PurchaseOrderLineItem(rice, regularWarehouse, 5, 10);
    po.addLineItem(item);
    po.cancel(new Date(), "Client cancelled");
    expect(po.status).toBe(PurchaseOrderStatus.DRAFT_CANCELLED);
    expect(item.status).toBe(LineItemStatus.LINE_CANCELLED);
  });

  it("should throw if trying to confirm a non-DRAFT purchase order", () => {
    const po = new PurchaseOrder(vendor, new Date());
    po.cancel(new Date(), "Cancelled");
    expect(() => po.confirm(new Date(), "Oops")).toThrow("Only DRAFT purchase orders can be confirmed.");
  });

});
