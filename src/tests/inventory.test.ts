import { Product, Warehouse } from "../modules/domain/common/commonEntities";
import { Quantity } from "../modules/domain/common/genericValueObjects";
import { InventoryEntry } from "../modules/inventory/models/inventory";

describe("Inventory Domain Model", () => {
  const activeWarehouse = Warehouse.fromDb("w1", "W1", "Main Warehouse", true, false);
  const inactiveWarehouse = Warehouse.fromDb("W2", "W2", "Old Warehouse", false, false);
  const refrigeratedWarehouse = Warehouse.fromDb("W3", "W3", "Cold Storage", true, true);

  const activeProduct = Product.fromDb("P1", "SKU123", "Milk", true, false);
  const inactiveProduct = Product.fromDb("P2", "SKU456", "Eggs", false, false);
  const refrigeratedProduct = Product.fromDb("P3", "SKU789", "Ice Cream", true, true);

  describe("Warehouse.canStore", () => {
    it("returns true if product and warehouse refrigeration matches", () => {
      expect(refrigeratedWarehouse.canStore(refrigeratedProduct)).toBe(true);
    });

    it("returns false if refrigeration requirement does not match", () => {
      expect(activeWarehouse.canStore(refrigeratedProduct)).toBe(false);
    });
  });

  describe("InventoryEntry.createNew", () => {
    it("creates a new inventory entry with valid inputs", () => {
      const entry = InventoryEntry.createNew(activeProduct, activeWarehouse, new Quantity(10, "pcs"));
      expect(entry.quantity.value).toBe(10);
    });

    it("throws if warehouse is inactive", () => {
      expect(() => InventoryEntry.createNew(activeProduct, inactiveWarehouse)).toThrow("Warehouse is not active.");
    });

    it("throws if product is inactive", () => {
      expect(() => InventoryEntry.createNew(inactiveProduct, activeWarehouse)).toThrow("Product is not active.");
    });

    it("throws if warehouse cannot store product", () => {
      expect(() => InventoryEntry.createNew(refrigeratedProduct, activeWarehouse)).toThrow("Warehouse cannot store this product type.");
    });
  });

  describe("InventoryEntry.fromDB", () => {
    it("creates entry with provided values", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-1",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: new Quantity(5, "pcs")
      });

      expect(entry.quantity.value).toBe(5);
    });
  });

  describe("InventoryEntry.addStock", () => {
    it("adds stock correctly", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-2",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: new Quantity(5, "pcs")
      });

      entry.addStock(new Quantity(3, "pcs"));
      expect(entry.quantity.value).toBe(8);
    });

    it("throws if warehouse is inactive", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-3",
        product: activeProduct,
        warehouse: inactiveWarehouse,
        quantity: new Quantity(5, "pcs")
      });

      expect(() => entry.addStock(new Quantity(1, "pcs") )).toThrow("Warehouse is not active.");
    });
  });

  describe("InventoryEntry.takeStock", () => {
    it("deducts stock correctly", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-4",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: new Quantity(10, "pcs")
      });

      entry.takeStock(new Quantity(4, "pcs"));
      expect(entry.quantity.value).toBe(6);
    });

    it("throws if stock is insufficient", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-5",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: new Quantity(2, "pcs")
      });

      expect(() => entry.takeStock( new Quantity(5, "pcs") )).toThrow("Not enough stock available.");
    });

    it("handles multiple add and take operation correctly", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-5",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: new Quantity(2, "pcs")
      });
      entry.addStock(new Quantity(10, "pcs"));
      entry.takeStock(new Quantity(5, "pcs"));
      entry.takeStock(new Quantity(6, "pcs"));
      expect(entry.quantity.value).toBe(1);
    });
  });
});
