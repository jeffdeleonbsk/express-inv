// purchase-order.spec.ts
import { Product, Vendor, Warehouse } from "../modules/domain/common/commonEntities";
import { LineItemStatus, PurchaseOrderStatus } from "../modules/domain/common/enums";
import { Money, Quantity } from "../modules/domain/common/genericValueObjects";
import { UserAccess } from "../modules/domain/interfaces/iUserAccessService";
import { PurchaseOrder } from "../modules/purchaseOrder/models/PurchaseOrderCreation";
import { PurchaseOrderLineItem } from "../modules/purchaseOrder/models/PurchaseOrderLineItem";

describe("PurchaseOrder domain model", () => {
  const vendor = Vendor.fromDb("v1", "V001", "Test Vendor", true);
  const refrigeratedWarehouse = Warehouse.fromDb("w1", "WHR1", "Cold Storage", true, true);
  const regularWarehouse = Warehouse.fromDb("w2", "WH2", "Dry Storage", true, false);
  const frozenFish = Product.fromDb("p1", "SKU1", "Frozen Fish", true, true);
  const rice = Product.fromDb("p2", "SKU2", "Rice", true, false);
  const userId = "userWithAccess";


  it("should create a DRAFT purchase order", () => {
    const po = PurchaseOrder.createNew(vendor, new Date(), "Urgent");
    expect(po.status).toBe(PurchaseOrderStatus.DRAFT);
    expect(po.lineItems.length).toBe(0);
  });

  it("should add a line item with correct warehouse-product match", () => {
    const po = PurchaseOrder.createNew(vendor, new Date(), userId);
    const item = PurchaseOrderLineItem.createNew(frozenFish, refrigeratedWarehouse, new Quantity(10, "kg"), new Money(200, "PhP"));
    po.addLineItem(item);
    expect(po.lineItems.length).toBe(1);
    expect(item.status).toBe(LineItemStatus.DRAFT);
  });

  it("should throw error if product refrigeration doesn't match warehouse", () => {
    let poli = null;
    expect(() => {
      poli = PurchaseOrderLineItem.createNew(frozenFish, regularWarehouse, new Quantity(5, "kg"), new Money(100, "PhP"));
    }).toThrow("Product refrigeration requirement does not match warehouse capability.");
    expect(poli).toBeNull();
  });

  it("should allow update of warehouse, quantity, and price in DRAFT status", () => {
    const item = PurchaseOrderLineItem.createNew(rice, regularWarehouse, new Quantity(10, "50kg sacks"), new Money(50, "PhP"));
    const newWarehouse = Warehouse.fromDb("w3", "WH3", "Dry 2", true, false);
    item.updateWarehouse(newWarehouse);
    item.updateOrderedQuantity(new Quantity(20, "50kg sacks"));
    item.updateUnitPrice(new Money(45, "PhP"));
    expect(item.warehouse).toBe(newWarehouse);
    expect(item.orderedQuantity.value).toBe(20);
    expect(item.unitPrice.amount).toBe(45);
  });

  it("should confirm a DRAFT purchase order with all DRAFT line items", () => {
    const po = PurchaseOrder.createNew(vendor, new Date(), userId);
    const item1 = PurchaseOrderLineItem.createNew(rice, regularWarehouse, new Quantity(5, "50kg sacks")  , new Money(10, "PhP"));
    const item2 = PurchaseOrderLineItem.createNew(rice, regularWarehouse, new Quantity(10, "50kg sacks"), new Money(12, "PhP"));
    po.addLineItem(item1);
    po.addLineItem(item2);
    po.confirm(new Date(), "Ready to process");
    expect(po.status).toBe(PurchaseOrderStatus.CONFIRMED);
    expect(item1.status).toBe(LineItemStatus.CONFIRMED);
    expect(item2.status).toBe(LineItemStatus.CONFIRMED);
  });

  it("should cancel a DRAFT purchase order with all DRAFT line items", () => {
    const po = PurchaseOrder.createNew(vendor, new Date(), userId);
    const item = PurchaseOrderLineItem.createNew(rice, regularWarehouse, new Quantity(5, "50kg sacks"), new Money(10, "PhP"));
    po.addLineItem(item);
    po.cancel(new Date(), "Client cancelled");
    expect(po.status).toBe(PurchaseOrderStatus.DRAFT_CANCELLED);
    expect(item.status).toBe(LineItemStatus.LINE_CANCELLED);
  });

  it("should throw if trying to confirm a non-DRAFT purchase order", () => {
    const po = PurchaseOrder.createNew(vendor, new Date(), userId);
    po.cancel(new Date(), "Cancelled");
    expect(() => po.confirm(new Date(), "Oops")).toThrow("Only DRAFT purchase orders can be confirmed.");
  });

});
