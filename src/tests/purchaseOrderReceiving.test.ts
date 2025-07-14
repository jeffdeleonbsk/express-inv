import { Product, Warehouse } from "../modules/domain/common/commonEntities";
import { LineItemStatus, PurchaseOrderStatus } from "../modules/domain/common/enums";
import { Quantity } from "../modules/domain/common/genericValueObjects";
import { Delivery, IAddToInventoryService, ReceivingLineItem, ReceivingPurchaseOrder } from "../modules/purchaseOrder/models/PurchaseOrderReceiving";

describe("ReceivingPurchaseOrder", () => {

  interface IStock {
     productId: string ;
     warehouseId: string;
     deliveredQuantity: Quantity;
  }
  class MockInventoryService implements IAddToInventoryService {
    public stocks: IStock[] = [];
    public find(productId: string, warehouseId: string): IStock|undefined {
        const stock2 = this.stocks.find((stock) => stock.productId === productId && stock.warehouseId === warehouseId);
        return stock2;
    }

    public addStock(productId: string, warehouseId: string, deliveredQuantity: Quantity): void {
        const stock2 = this.stocks.find((stock) => stock.productId === productId && stock.warehouseId === warehouseId);
        if (stock2) {
            stock2.deliveredQuantity = new Quantity(stock2!.deliveredQuantity!.value + deliveredQuantity.value);
        } else {
            this.stocks.push({
                productId,
                warehouseId,
                deliveredQuantity: new Quantity(deliveredQuantity.value, deliveredQuantity.unit)
            });
        }
    }
  }

  const mockInventoryService = new MockInventoryService();

  const date = new Date("2025-07-08");
  const comment = "Received partial delivery";

  const createTestLineItem = (id: string= "line-item-id", productId: string= "product-1", warehouseId: string= "warehouse-1"): ReceivingLineItem => {
    const product = Product.fromDb(productId, productId, "Test Product", true, false);
    const warehouse = Warehouse.fromDb(warehouseId, warehouseId, "Test Warehouse", true, false);
    return ReceivingLineItem.fromDB({
      id,
      product,
      warehouse,
      orderedQuantity: new Quantity(10, "pcs"),
      status: LineItemStatus.CONFIRMED,
      deliveredQuantity: new Quantity(0, "pcs"),
      deliveries: [],
      dateDelivered: undefined,
      deliveredComment: undefined,
      dateCancelled: undefined,
      cancelledComment: undefined
    });
  };

  it("should receive delivery and update statuses", () => {
    const delivery = Delivery.createNew( "line-item-id", date, comment, new Quantity(5, "pcs"), );
    const lineItem = createTestLineItem();
    const po = ReceivingPurchaseOrder.fromDB({
          id: "po-1",
          status: PurchaseOrderStatus.CONFIRMED,
          lineItems: [lineItem],
          dateConfirmed: new Date("2025-07-01")
    });

    po.receiveDelivery("line-item-id", delivery, mockInventoryService);

    expect(lineItem.deliveredQuantity.value).toBe(5);
    expect(lineItem.status).toBe(LineItemStatus.PARTIALLY_FULFILLED);
    expect(po.status).toBe(PurchaseOrderStatus.PARTIALLY_FULFILLED);
    const stock = mockInventoryService.find("product-1", "warehouse-1");
    expect(stock).toBeDefined();
    expect(stock!.deliveredQuantity.value).toBe(5);
    const delivery2 = Delivery.createNew("line-item-id", date, comment, new Quantity(5, "pcs"), );
    po.receiveDelivery("line-item-id", delivery2, mockInventoryService);
    const stock2 = mockInventoryService.find("product-1", "warehouse-1");
    expect(stock2).toBeDefined();
    expect(stock2?.deliveredQuantity.value).toBe(10);

  });

  it("should mark line item and PO as fully delivered when quantity matches", () => {
    const delivery = Delivery.createNew("line-item-id", date, comment, new Quantity(10, "pcs"), );
    const lineItem = createTestLineItem();
    const po = ReceivingPurchaseOrder.fromDB({
          id: "po-1",
          status: PurchaseOrderStatus.CONFIRMED,
          lineItems: [lineItem],
          dateConfirmed: new Date("2025-07-01")
    });
    po.receiveDelivery("line-item-id", delivery, mockInventoryService);

    expect(lineItem.status).toBe(LineItemStatus.FULLY_DELIVERED);
    expect(po.status).toBe(PurchaseOrderStatus.FULLY_DELIVERED);
    expect(po.dateDelivered).toEqual(date);
    expect(po.deliveredComment).toBe(comment);
  });

  it("should cancel line item and update PO status if all cancelled", () => {
    const lineItem = createTestLineItem();
    const po = ReceivingPurchaseOrder.fromDB({
          id: "po-1",
          status: PurchaseOrderStatus.CONFIRMED,
          lineItems: [lineItem],
          dateConfirmed: new Date("2025-07-01")
    });

    po.cancelLineItem("line-item-id", date, comment);

    expect(lineItem.status).toBe(LineItemStatus.LINE_CANCELLED);
    expect(po.status).toBe(PurchaseOrderStatus.ORDER_CANCELLED);
  });

  it("should throw error if receiving delivery in invalid PO status", () => {
    const delivery = Delivery.createNew("line-item-id", date, comment, new Quantity(5, "pcs"), );
    const lineItem = createTestLineItem();
    const po =  ReceivingPurchaseOrder.fromDB({
          id: "po-1",
          status: PurchaseOrderStatus.DRAFT_CANCELLED,
          lineItems: [lineItem],
          dateConfirmed: undefined
    });

    expect(() => po.receiveDelivery("line-item-id", delivery, mockInventoryService)).toThrow(
      "Purchase order is not in a receivable state."
    );
  });

  it("should throw error if receiving delivery in invalid PO status", () => {
    const lineItem = createTestLineItem();
    const line2 = createTestLineItem("line-item-id2", "product-2", "warehouse-1");
    const po = ReceivingPurchaseOrder.fromDB({
          id: "po-1",
          status: PurchaseOrderStatus.CONFIRMED,
          lineItems: [lineItem],
          dateConfirmed: new Date("2025-07-01")
    });

    po.cancelLineItem("line-item-id", new Date(), "cancelled for test");
    // since there is only one line item and it is cancelled, the PO should also be already cancelled
    expect(po.status).toBe(PurchaseOrderStatus.ORDER_CANCELLED);
    const delivery = Delivery.createNew("line-item-id", date, comment, new Quantity(5, "pcs"), );
    expect(() => po.receiveDelivery("line-item-id", delivery, mockInventoryService)).toThrow(
      "Purchase order is not in a receivable state."
    );
  });
  it("should throw error if receiving delivery in invalid line item status", () => {
    const lineItem = createTestLineItem();
    const line2 = createTestLineItem("line-item-id2", "product-2", "warehouse-1");
    const po = ReceivingPurchaseOrder.fromDB({
          id: "po-1",
          status: PurchaseOrderStatus.CONFIRMED,
          lineItems: [lineItem, line2],
          dateConfirmed: new Date("2025-07-01")
    });

    po.cancelLineItem("line-item-id", new Date(), "cancelled for test");
    expect(po.status).toBe(PurchaseOrderStatus.CONFIRMED);
    const delivery = Delivery.createNew("line-item-id", date, comment, new Quantity(5, "pcs"), );
    expect(() => po.receiveDelivery("line-item-id", delivery, mockInventoryService)).toThrow(
      "Cannot receive delivery in current line item status."
    );
  });
});
