import Database from "better-sqlite3";
import {v4 as uuidv4} from "uuid"
import dotenv from "dotenv";

dotenv.config();
const dbName = process.env.SQLITE_DB;
const db = new Database(dbName);
       
const insertUserStmt = db.prepare<[string, string, string, string, string, string], number>(
    "INSERT INTO users (id, firstname, lastname, email, status, role_code) VALUES (?, ?, ?, ?, ?, ?)"
);
insertUserStmt.run(uuidv4(), "Admin Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", "ACTIVE", "ADMIN");
insertUserStmt.run(uuidv4(), "Encoder Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", "ACTIVE", "ENCODER");
insertUserStmt.run(uuidv4(), "PO Admin Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", "ACTIVE", "PO_ADMIN");

const insertRaStmt = db.prepare<[string, string, string, number, number, number, number, number, number, number], number>(
    `INSERT INTO role_access (
    id,
    role_code, resource_code, 
     can_read_own_object, can_update_own_object, can_delete_own_object, 
     can_list, can_add_object, can_update_object, can_delete_object) VALUES 
     (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);


insertRaStmt.run(uuidv4(), "ADMIN", "USERS", 1,1,1, 1,1,1,1  );
insertRaStmt.run(uuidv4(), "ADMIN", "PURCHASES", 1,1,1, 1,1,1,1  );
insertRaStmt.run(uuidv4(), "ADMIN", "TRANSFERS", 1,1,1, 1,1,1,1  );
insertRaStmt.run(uuidv4(), "PO_ADMIN", "USERS", 1,1,1, 0,0,0,0  );
insertRaStmt.run(uuidv4(), "PO_ADMIN", "PURCHASES", 1,1,1, 1,1,1,1  );
insertRaStmt.run(uuidv4(), "PO_ADMIN", "TRANSFERS", 0,0,0, 0,0,0,0  );
insertRaStmt.run(uuidv4(), "ENCODER", "USERS", 1,1,1, 0,0,0,0  );
insertRaStmt.run(uuidv4(), "ENCODER", "PURCHASES", 1,1,1, 1,1,1,1  );
insertRaStmt.run(uuidv4(), "ENCODER", "TRANSFERS", 1,1,1, 1,1,1,1  );

const insertRole = db.prepare<[string,string,string,number], number>(
    `INSERT INTO roles (code, name, description, is_active) VALUES (?, ?, ?, ?)`
);

insertRole.run("ADMIN", "Admin", "Super Admin", 1);
insertRole.run("ENCODER", "Encoder", "Encode Data into system",  1);
insertRole.run("PO_ADMIN", "Purchase Order Admin", "Point person in purchasing",  1);

const insertResource = db.prepare<[string,string,string,number], number>(
    `INSERT INTO role_resources (code, name, description, is_active) VALUES (?, ?, ?, ?)`
);
insertResource.run("USERS", "User Module", "Module for managing users and access roles", 1);
insertResource.run("PURCHASES", "Purchase Order Module", "Module for the Purchase Orders",  1);
insertResource.run("TRANSFERS", "Transfers Module", "Module for managing/tracking transfers between warehouses",  1);
