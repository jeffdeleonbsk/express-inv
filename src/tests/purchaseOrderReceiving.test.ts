import { LineItemStatus, PurchaseOrderStatus } from "../modules/domain/common/enums";
import { Delivery, IAddToInventoryService, ReceivingLineItem, ReceivingPurchaseOrder } from "../modules/domain/purchaseOrder/PurchaseOrderReceiving";

describe("ReceivingPurchaseOrder", () => {

  interface IStock {
     productId: string|null ;
     warehouseId: string|null;
     deliveredQuantity: number|0 ;
  }
  class MockInventoryService implements IAddToInventoryService {
    public stocks: IStock[] = [];
    public find(productId: string, warehouseId: string): IStock|undefined {
        const stock2 = this.stocks.find((stock) => stock.productId === productId && stock.warehouseId === warehouseId);
        return stock2;
    }

    public addStock(productId: string, warehouseId: string, deliveredQuantity: number): void {

        const stock2 = this.stocks.find((stock) => stock.productId === productId && stock.warehouseId === warehouseId);
        if (stock2) {
            stock2.deliveredQuantity += deliveredQuantity;
        } else {
            this.stocks.push({
                productId,
                warehouseId,
                deliveredQuantity
            });
        }
    }
  }

  const mockInventoryService = new MockInventoryService();

  const date = new Date("2025-07-08");
  const comment = "Received partial delivery";

  const createTestLineItem = (id: string= "line-item-id", productId: string= "product-1", warehouseId: string= "warehouse-1"): ReceivingLineItem =>
    new ReceivingLineItem(
      id,
      productId,
      warehouseId,
      10,
      LineItemStatus.CONFIRMED,
      0,
      [],
      undefined,
      undefined,
      undefined,
      undefined
    );

  it("should receive delivery and update statuses", () => {
    const delivery = new Delivery("line-item-id", date, comment, 5);
    const lineItem = createTestLineItem();
    const po = new ReceivingPurchaseOrder("po-1", PurchaseOrderStatus.CONFIRMED, [lineItem]);

    po.receiveDelivery("line-item-id", delivery, mockInventoryService);

    expect(lineItem.deliveredQuantity).toBe(5);
    expect(lineItem.status).toBe(LineItemStatus.PARTIALLY_FULFILLED);
    expect(po.status).toBe(PurchaseOrderStatus.PARTIALLY_FULFILLED);
    const stock = mockInventoryService.find("product-1", "warehouse-1");
    expect(stock).toBeDefined();
    expect(stock?.deliveredQuantity).toBe(5);
    const delivery2 = new Delivery("line-item-id", date, comment, 5);
    po.receiveDelivery("line-item-id", delivery2, mockInventoryService);
    const stock2 = mockInventoryService.find("product-1", "warehouse-1");
    expect(stock2).toBeDefined();
    expect(stock2?.deliveredQuantity).toBe(10);

  });

  it("should mark line item and PO as fully delivered when quantity matches", () => {
    const delivery = new Delivery("line-item-id", date, comment, 10);
    const lineItem = createTestLineItem();
    const po = new ReceivingPurchaseOrder("po-1", PurchaseOrderStatus.CONFIRMED, [lineItem]);

    po.receiveDelivery("line-item-id", delivery, mockInventoryService);

    expect(lineItem.status).toBe(LineItemStatus.FULLY_DELIVERED);
    expect(po.status).toBe(PurchaseOrderStatus.FULLY_DELIVERED);
    expect(po.dateDelivered).toEqual(date);
    expect(po.deliveredComment).toBe(comment);
  });

  it("should cancel line item and update PO status if all cancelled", () => {
    const lineItem = createTestLineItem();
    const po = new ReceivingPurchaseOrder("po-1", PurchaseOrderStatus.CONFIRMED, [lineItem]);

    po.cancelLineItem("line-item-id", date, comment);

    expect(lineItem.status).toBe(LineItemStatus.LINE_CANCELLED);
    expect(po.status).toBe(PurchaseOrderStatus.ORDER_CANCELLED);
  });

  it("should throw error if receiving delivery in invalid PO status", () => {
    const delivery = new Delivery("line-item-id", date, comment, 5);
    const lineItem = createTestLineItem();
    const po = new ReceivingPurchaseOrder("po-1", PurchaseOrderStatus.DRAFT, [lineItem]);

    expect(() => po.receiveDelivery("line-item-id", delivery, mockInventoryService)).toThrow(
      "Purchase order is not in a receivable state."
    );
  });

  it("should throw error if receiving delivery in invalid line item status", () => {
    const delivery = new Delivery("line-item-id", date, comment, 5);
    const lineItem = createTestLineItem();
    const line2 = createTestLineItem("line-item-id2", "product-2", "warehouse-1");
    const po = new ReceivingPurchaseOrder("po-1", PurchaseOrderStatus.CONFIRMED, [lineItem, line2]);

    po.cancelLineItem("line-item-id", new Date(), "cancelled for test");
    expect(() => po.receiveDelivery("line-item-id", delivery, mockInventoryService)).toThrow(
      "Cannot receive delivery in current line item status."
    );
  });
});
