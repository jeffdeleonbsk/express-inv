import { PurchaseOrder } from "./models/PurchaseOrderCreation";
import { ReceivingPurchaseOrder } from "./models/PurchaseOrderReceiving";
import { Product, Vendor, Warehouse } from "../domain/common/domainValueObjects";

export interface IPurchaseOrderDb {
  // Creation PO
  getPurchaseOrderById(id: string): Promise<PurchaseOrder | null>;
  addPO(po: PurchaseOrder): Promise<number>; // returns new PO id
  updatePO(po: PurchaseOrder): Promise<number>;
  deletePO(id: string): Promise<number>;

  // Receiving PO
  getReceivingById(id: string): Promise<ReceivingPurchaseOrder | null>;
  updateReceiving(po: ReceivingPurchaseOrder): Promise<number>;

  getVendorById(id: string): Promise<Vendor | null>;
  getWarehouseById(id: string): Promise<Warehouse | null>;
  getProductById(id: string): Promise<Product | null>;
}
