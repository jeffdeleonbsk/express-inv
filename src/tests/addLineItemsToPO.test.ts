import { Money, Quantity } from "../modules/domain/common/genericValueObjects";
import { AddLineItemToPurchaseOrderCmd, AddLineItemToPurchaseOrderRequest } from "../modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd";

describe("AddLineItemToPurchaseOrderCmd", () => {
    const mockDb = {
        getPurchaseOrderById: jest.fn(),
        getProductById: jest.fn(),
        getWarehouseById: jest.fn(),
        updatePO: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should add a line item to an existing purchase order", async () => {
        const po = { addLineItem: jest.fn(), id: "po1" };
        const product = { id: "prod1", isActive: true };
        const warehouse = { id: "wh1", isActive: true };
        mockDb.getPurchaseOrderById.mockResolvedValue(po);
        mockDb.getProductById.mockResolvedValue(product);
        mockDb.getWarehouseById.mockResolvedValue(warehouse);
        mockDb.updatePO.mockResolvedValue(1);
        const req = new AddLineItemToPurchaseOrderRequest(
            "po1",
            "prod1",
            "wh1",
            10, "pcs",
            100, "PHP"
        );
        const cmd = new AddLineItemToPurchaseOrderCmd(req, mockDb as any);
        const result = await cmd.execute();
        expect(result.isSuccess).toBe(true);
        expect(result.result?.purchaseOrderId).toBe("po1");
        expect(po.addLineItem).toHaveBeenCalled();
        expect(mockDb.updatePO).toHaveBeenCalledWith(po);
    });

    it("should fail if purchase order is not found", async () => {
        mockDb.getPurchaseOrderById.mockResolvedValue(null);
        const req = new AddLineItemToPurchaseOrderRequest("bad-po", "prod1", "wh1", 1, "pcs", 1, "PHP");
        const cmd = new AddLineItemToPurchaseOrderCmd(req, mockDb as any);
        const result = await cmd.execute();
        expect(result.isSuccess).toBe(false);
    });

    it("should fail if product is not found", async () => {
        mockDb.getPurchaseOrderById.mockResolvedValue({ addLineItem: jest.fn(), id: "po1" });
        mockDb.getProductById.mockResolvedValue(null);
        const req = new AddLineItemToPurchaseOrderRequest("po1", "bad-prod", "wh1", 1, "pcs", 1, "PHP");
        const cmd = new AddLineItemToPurchaseOrderCmd(req, mockDb as any);
        const result = await cmd.execute();
        expect(result.isSuccess).toBe(false);
    });

    it("should fail if warehouse is not found", async () => {
        mockDb.getPurchaseOrderById.mockResolvedValue({ addLineItem: jest.fn(), id: "po1" });
        mockDb.getProductById.mockResolvedValue({ id: "prod1" });
        mockDb.getWarehouseById.mockResolvedValue(null);
        const req = new AddLineItemToPurchaseOrderRequest("po1", "prod1", "bad-wh", 1, "pcs", 1, "PHP");
        const cmd = new AddLineItemToPurchaseOrderCmd(req, mockDb as any);
        const result = await cmd.execute();
        expect(result.isSuccess).toBe(false);
    });
});
