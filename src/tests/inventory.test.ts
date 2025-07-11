import { InventoryEntry, Product, Warehouse } from "../modules/domain/inventory/inventory";

describe("Inventory Domain Model", () => {
  const activeWarehouse = new Warehouse("W1", "Main Warehouse", false, true);
  const inactiveWarehouse = new Warehouse("W2", "Old Warehouse", false, false);
  const refrigeratedWarehouse = new Warehouse("W3", "Cold Storage", true, true);

  const activeProduct = new Product("P1", "SKU123", "Milk", false, true);
  const inactiveProduct = new Product("P2", "SKU456", "Eggs", false, false);
  const refrigeratedProduct = new Product("P3", "SKU789", "Ice Cream", true, true);

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
      const entry = InventoryEntry.createNew(activeProduct, activeWarehouse, 10);
      expect(entry.getQuantity()).toBe(10);
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
        quantity: 5
      });

      expect(entry.getQuantity()).toBe(5);
    });
  });

  describe("InventoryEntry.addStock", () => {
    it("adds stock correctly", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-2",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: 5
      });

      entry.addStock(3);
      expect(entry.getQuantity()).toBe(8);
    });

    it("throws if warehouse is inactive", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-3",
        product: activeProduct,
        warehouse: inactiveWarehouse,
        quantity: 5
      });

      expect(() => entry.addStock(1)).toThrow("Warehouse is not active.");
    });
  });

  describe("InventoryEntry.takeStock", () => {
    it("deducts stock correctly", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-4",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: 10
      });

      entry.takeStock(4);
      expect(entry.getQuantity()).toBe(6);
    });

    it("throws if stock is insufficient", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-5",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: 2
      });

      expect(() => entry.takeStock(5)).toThrow("Not enough stock available.");
    });

    it("handles multiple add and take operation correctly", () => {
      const entry = InventoryEntry.fromDB({
        id: "entry-5",
        product: activeProduct,
        warehouse: activeWarehouse,
        quantity: 2
      });
      entry.addStock(10);
      entry.takeStock(5);
      entry.takeStock(6);
      expect(entry.getQuantity()).toBe(1);
    });    
  });
});