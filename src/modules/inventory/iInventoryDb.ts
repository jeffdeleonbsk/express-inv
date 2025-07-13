import { Product, Warehouse } from "../domain/common/domainValueObjects";
import { InventoryEntry } from "./models/inventory";

export interface IInventoryDb {
    getById(id: string): Promise<InventoryEntry | null>;
    add(item: InventoryEntry): Promise<string>; // returns new item id
    update(item: InventoryEntry): Promise<number>; // returns number of rows updated
    delete(id: string): Promise<number>; // returns number of rows deleted
    
    getProductById(id: string): Promise<Product | null>;
    getWarehouseById(id: string): Promise<Warehouse | null>;
}