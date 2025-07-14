import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();
const dbName = process.env.SQLITE_DB;
const db = new Database(dbName);

const sqls: string[] = [];

sqls.push(`DROP TABLE IF EXISTS "users";`);
sqls.push(`DROP TABLE IF EXISTS "roles";`);
sqls.push(`DROP TABLE IF EXISTS "role_access";`);
sqls.push(`DROP TABLE IF EXISTS "role_resources";`);
sqls.push(`DROP TABLE IF EXISTS "purchase_orders";`);
sqls.push(`DROP TABLE IF EXISTS "purchase_order_line_items";`);
sqls.push(`DROP TABLE IF EXISTS "deliveries";`);
sqls.push(`DROP TABLE IF EXISTS "vendors";`);
sqls.push(`DROP TABLE IF EXISTS "warehouses";`);
sqls.push(`DROP TABLE IF EXISTS "products";`);
sqls.push(`DROP TABLE IF EXISTS "inventory_items";`);

sqls.push(`CREATE TABLE "users" (
	"id" VARCHAR(60) NOT NULL,
	"firstname" VARCHAR(255)  NOT NULL,
	"lastname" VARCHAR(255)  NOT NULL,
	"email" VARCHAR(255)  NOT NULL,
	"password" VARCHAR(255)  NOT NULL,
	"status" VARCHAR(255)  NOT NULL,
	"role_code" VARCHAR(20)  NOT NULL,
	PRIMARY KEY ("id")
);`);

sqls.push(`CREATE TABLE "roles" (
	"code" VARCHAR(20)  NOT NULL,
	"name" VARCHAR(50)  NOT NULL,
	"description" VARCHAR(50) NULL,
	"is_active" INTEGER  NOT NULL,
	PRIMARY KEY ("code")
);`);
sqls.push(`CREATE TABLE "role_access" (
	"id" VARCHAR(60) NOT NULL,
	"role_code" VARCHAR(20)  NOT NULL,	
	"resource_code" VARCHAR(20)  NOT NULL,
	"can_list" TINYINT  NOT NULL,
	"can_read_own_object" TINYINT  NOT NULL,
	"can_update_own_object" TINYINT  NOT NULL,
	"can_delete_own_object" TINYINT  NOT NULL,
	"can_delete_object" TINYINT  NOT NULL,
	"can_add_object" TINYINT  NOT NULL,
	"can_update_object" TINYINT  NOT NULL,
	PRIMARY KEY ("id")
);`);

sqls.push(`CREATE TABLE "role_resources" (
	"code" VARCHAR(20)  NOT NULL,
	"name" VARCHAR(50)  NOT NULL,
	"description" VARCHAR(50) NULL,
	"is_active" INTEGER  NOT NULL,
	PRIMARY KEY ("code")
);`);


sqls.push(`CREATE TABLE "purchase_orders" (
	"id" VARCHAR(60) NOT NULL,
	"vendor_id" VARCHAR(60) NOT NULL,
	"owner_id" VARCHAR(60) NOT NULL,
	"status" VARCHAR(30) NOT NULL,
	"date_created" DATETIME NOT NULL,
	"date_confirmed" DATETIME NULL,
	"date_cancelled" DATETIME NULL,
	"date_delivered" DATETIME NULL,
	"date_closed" DATETIME NULL,
	"delivered_comment" VARCHAR(255) NULL,
	"cancelled_comment" VARCHAR(255) NULL,
	"closed_comment" VARCHAR(255) NULL,
	"confirmed_comment" VARCHAR(255) NULL,
	"created_comment" VARCHAR(255) NULL,
	PRIMARY KEY ("id")
);`);

sqls.push(`CREATE TABLE "purchase_order_line_items" (
	"id" VARCHAR(60) NOT NULL,
	"purchase_order_id" VARCHAR(60) NOT NULL,
	"product_id" VARCHAR(60) NOT NULL,
	"warehouse_id" VARCHAR(60) NOT NULL,
	"ordered_quantity" REAL NOT NULL,
	"ordered_quantity_unit" VARCHAR(20) NOT NULL,
	"status" VARCHAR(30) NOT NULL,
	"delivered_quantity" REAL,
	"delivered_quantity_unit" VARCHAR(20),
	"unit_price" REAL,
	"unit_price_currency" VARCHAR(20),
	"date_created" DATETIME NOT NULL,
	"date_confirmed" DATETIME NULL,
	"date_cancelled" DATETIME NULL,
	"date_delivered" DATETIME NULL,
	"date_closed" DATETIME NULL,
	"delivered_comment" VARCHAR(255) NULL,
	"cancelled_comment" VARCHAR(255) NULL,
	"closed_comment" VARCHAR(255) NULL,
	"confirmed_comment" VARCHAR(255) NULL,
	PRIMARY KEY ("id"),
	FOREIGN KEY("purchase_order_id") REFERENCES "purchase_orders"("id")
);`);

sqls.push(`CREATE TABLE "deliveries" (
	"id" VARCHAR(60) NOT NULL,
	"line_item_id" VARCHAR(60) NOT NULL,
	"date_delivered" DATETIME NOT NULL,
	"delivery_comment" TEXT,
	"delivered_quantity" REAL NOT NULL,
	"delivered_quantity_unit" VARCHAR(20) NOT NULL,
	PRIMARY KEY ("id"),
	FOREIGN KEY("line_item_id") REFERENCES "purchase_order_line_items"("id")
);`);

sqls.push(`CREATE TABLE "vendors" (
	"id" VARCHAR(60) NOT NULL,
	"short_code" VARCHAR(20) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"is_active" INTEGER NOT NULL,
	PRIMARY KEY ("id")
);`);

sqls.push(`CREATE TABLE "warehouses" (
	"id" VARCHAR(60) NOT NULL,
	"short_code" VARCHAR(20) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"is_active" INTEGER NOT NULL,
	"is_refrigerated" INTEGER NOT NULL,
	PRIMARY KEY ("id")
);`);

sqls.push(`CREATE TABLE "products" (
	"id" VARCHAR(60) NOT NULL,
	"sku" VARCHAR(50) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"is_active" INTEGER NOT NULL,
	"need_refrigeration" INTEGER NOT NULL,
	PRIMARY KEY ("id")
);`);

sqls.push(`CREATE TABLE "inventory_items" (
	"id" VARCHAR(60) NOT NULL,
	"product_id" VARCHAR(60) NOT NULL,
	"warehouse_id" VARCHAR(60) NOT NULL,
	"quantity" REAL NOT NULL,
	"quantity_unit" VARCHAR(20) NOT NULL,
	PRIMARY KEY ("id")
);`);

sqls.forEach((sql) => {
    db.exec(sql);
});