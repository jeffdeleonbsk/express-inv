import { CreatePurchaseOrderCmd, CreatePurchaseOrderRequest } from "../modules/purchaseOrder/commands/createPurchaseOrderCmd";
import { PurchaseOrder } from "../modules/purchaseOrder/models/PurchaseOrderCreation";
import { Vendor } from "../modules/domain/common/domainValueObjects";
import { Result } from "../modules/common/result";

describe("CreatePurchaseOrderCmd", () => {
    const mockDb = {
        getVendorById: jest.fn(),
        addPO: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a purchase order and return its id", async () => {
        const vendor = Vendor.fromDb("v1", "VEND1", "Acme Supplies", true);
        mockDb.getVendorById.mockResolvedValue(vendor);
        mockDb.addPO.mockResolvedValue(1);
        const req = new CreatePurchaseOrderRequest(vendor.id, new Date("2025-07-13"), "Test PO");
        const cmd = new CreatePurchaseOrderCmd(req, mockDb as any);
        const result = await cmd.execute();
        expect(result.isSuccess).toBe(true);
        expect(result.result?.id).toBeDefined();
        expect(mockDb.getVendorById).toHaveBeenCalledWith(vendor.id);
        expect(mockDb.addPO).toHaveBeenCalled();
    });

    it("should fail if vendor is not found", async () => {
        mockDb.getVendorById.mockResolvedValue(null);
        const req = new CreatePurchaseOrderRequest("bad-id", new Date(), "");
        const cmd = new CreatePurchaseOrderCmd(req, mockDb as any);
        const result = await cmd.execute();
        expect(result.isSuccess).toBe(false);
    });
});
