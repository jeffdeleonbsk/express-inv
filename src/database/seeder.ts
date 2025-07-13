import * as bcrypt from "bcrypt";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import {v4 as uuidv4} from "uuid";

dotenv.config();

const dbName = process.env.SQLITE_DB;
const db = new Database(dbName);

const insertUserStmt = db.prepare<[string, string, string, string, string, string, string], number>(
    "INSERT INTO users (id, firstname, lastname, email, password, status, role_code) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

bcrypt.hash("abc123", 10).then((hash) => {
insertUserStmt.run(uuidv4(), "Admin Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", hash,  "ACTIVE", "ADMIN");
insertUserStmt.run(uuidv4(), "Encoder Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", hash, "ACTIVE", "ENCODER");
insertUserStmt.run(uuidv4(), "PO Admin Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", hash, "ACTIVE", "PO_ADMIN");

});

const insertRaStmt = db.prepare
<[string, string, string, number, number, number, number, number, number, number], number>(
    `INSERT INTO role_access (
    id,
    role_code, resource_code,
     can_read_own_object, can_update_own_object, can_delete_own_object,
     can_list, can_add_object, can_update_object, can_delete_object) VALUES
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

insertRaStmt.run(uuidv4(), "ADMIN", "USERS", 1, 1, 1, 1, 1, 1, 1  );
insertRaStmt.run(uuidv4(), "ADMIN", "PURCHASES", 1, 1, 1, 1, 1, 1, 1  );
insertRaStmt.run(uuidv4(), "ADMIN", "TRANSFERS", 1, 1, 1, 1, 1, 1, 1  );
insertRaStmt.run(uuidv4(), "PO_ADMIN", "USERS", 1, 1, 1, 0, 0, 0, 0  );
insertRaStmt.run(uuidv4(), "PO_ADMIN", "PURCHASES", 1, 1, 1, 1, 1, 1, 1  );
insertRaStmt.run(uuidv4(), "PO_ADMIN", "TRANSFERS", 0, 0, 0, 0, 0, 0, 0  );
insertRaStmt.run(uuidv4(), "ENCODER", "USERS", 1, 1, 1, 0, 0, 0, 0  );
insertRaStmt.run(uuidv4(), "ENCODER", "PURCHASES", 1, 1, 1, 1, 1, 1, 1  );
insertRaStmt.run(uuidv4(), "ENCODER", "TRANSFERS", 1, 1, 1, 1, 1, 1, 1  );

const insertRole = db.prepare<[string, string, string, number], number>(
    `INSERT INTO roles (code, name, description, is_active) VALUES (?, ?, ?, ?)`
);

insertRole.run("ADMIN", "Admin", "Super Admin", 1);
insertRole.run("ENCODER", "Encoder", "Encode Data into system",  1);
insertRole.run("PO_ADMIN", "Purchase Order Admin", "Point person in purchasing",  1);

const insertResource = db.prepare<[string, string, string, number], number>(
    `INSERT INTO role_resources (code, name, description, is_active) VALUES (?, ?, ?, ?)`
);
insertResource.run("USERS", "User Module", "Module for managing users and access roles", 1);
insertResource.run("PURCHASES", "Purchase Order Module", "Module for the Purchase Orders",  1);
insertResource.run("TRANSFERS", "Transfers Module", "Module for managing/tracking transfers between warehouses",  1);

const insertWarehouse = db.prepare< [
  string, string, string, number, number
], number>(
  `INSERT INTO warehouses (id, short_code, name, is_active, is_refrigerated) VALUES (?, ?, ?, ?, ?)`
);
insertWarehouse.run(uuidv4(), "WH1", "Main Warehouse", 1, 0);
insertWarehouse.run(uuidv4(), "WH2", "Cold Storage", 1, 1);
insertWarehouse.run(uuidv4(), "WH3", "Inactive Warehouse", 0, 0);

const insertVendor = db.prepare< [
  string, string, string, number
], number>(
  `INSERT INTO vendors (id, short_code, name, is_active) VALUES (?, ?, ?, ?)`
);
insertVendor.run(uuidv4(), "VEND1", "Acme Supplies", 1);
insertVendor.run(uuidv4(), "VEND2", "Fresh Foods", 1);
insertVendor.run(uuidv4(), "VEND3", "Old Vendor", 0);

const insertProduct = db.prepare< [
  string, string, string, number, number
], number>(
  `INSERT INTO products (id, sku, name, is_active, need_refrigeration) VALUES (?, ?, ?, ?, ?)`
);
insertProduct.run(uuidv4(), "SKU1", "Regular Widget", 1, 0);
insertProduct.run(uuidv4(), "SKU2", "Frozen Peas", 1, 1);
insertProduct.run(uuidv4(), "SKU3", "Obsolete Part", 0, 0);
