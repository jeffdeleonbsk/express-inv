import { PurchaseOrder } from "./domain/purchaseOrder";

export interface IPurchaseOrderDb {
    GetOrderById(id: number, loadRole?: boolean, loadRoleAccess?: boolean): Promise<PurchaseOrder|null>;
    Add(po: PurchaseOrder): Promise<number>;
    Update(po: PurchaseOrder): Promise<number>;
    Delete(po: PurchaseOrder): Promise<number>;
}
