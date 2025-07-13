CREATE TABLE "users" (
	"id" VARCHAR(40) NOT NULL,
	"firstname" VARCHAR(255)  NOT NULL,
	"lastname" VARCHAR(255)  NOT NULL,
	"email" VARCHAR(255)  NOT NULL,
	"password" VARCHAR(255)  NOT NULL,
	"status" VARCHAR(255)  NOT NULL,
	"role_code" VARCHAR(20)  NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "roles" (
	"code" VARCHAR(20)  NOT NULL,
	"name" VARCHAR(50)  NOT NULL,
	"description" VARCHAR(50) NULL,
	"is_active" INTEGER  NOT NULL,
	PRIMARY KEY ("code")
);
CREATE TABLE "role_access" (
	"id" VARCHAR(40) NOT NULL,
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
);

CREATE TABLE "role_resources" (
	"code" VARCHAR(20)  NOT NULL,
	"name" VARCHAR(50)  NOT NULL,
	"description" VARCHAR(50) NULL,
	"is_active" INTEGER  NOT NULL,
	PRIMARY KEY ("code")
);


-- Purchase Orders
CREATE TABLE "purchase_orders" (
	"id" VARCHAR(40) NOT NULL,
	"vendor_id" VARCHAR(40) NOT NULL,
	"owner_id" VARCHAR(40) NOT NULL,
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
);

CREATE TABLE "purchase_order_line_items" (
	"id" VARCHAR(40) NOT NULL,
	"purchase_order_id" VARCHAR(40) NOT NULL,
	"product_id" VARCHAR(40) NOT NULL,
	"warehouse_id" VARCHAR(40) NOT NULL,
	"ordered_quantity" REAL NOT NULL,
	"ordered_quantity_unit" VARCHAR(20) NOT NULL,
	"status" VARCHAR(30) NOT NULL,
	"delivered_quantity" REAL,
	"delivered_quantity_unit" VARCHAR(20),
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
);

CREATE TABLE "deliveries" (
	"id" VARCHAR(40) NOT NULL,
	"line_item_id" VARCHAR(40) NOT NULL,
	"date_delivered" DATETIME NOT NULL,
	"delivery_comment" TEXT,
	"delivered_quantity" REAL NOT NULL,
	"delivered_quantity_unit" VARCHAR(20) NOT NULL,
	PRIMARY KEY ("id"),
	FOREIGN KEY("line_item_id") REFERENCES "purchase_order_line_items"("id")
);

CREATE TABLE "vendors" (
	"id" VARCHAR(40) NOT NULL,
	"short_code" VARCHAR(20) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"is_active" INTEGER NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "warehouses" (
	"id" VARCHAR(40) NOT NULL,
	"short_code" VARCHAR(20) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"is_active" INTEGER NOT NULL,
	"is_refrigerated" INTEGER NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "products" (
	"id" VARCHAR(40) NOT NULL,
	"sku" VARCHAR(50) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"is_active" INTEGER NOT NULL,
	"need_refrigeration" INTEGER NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "inventory_items" (
	"id" VARCHAR(40) NOT NULL,
	"product_id" VARCHAR(40) NOT NULL,
	"warehouse_id" VARCHAR(40) NOT NULL,
	"quantity" REAL NOT NULL,
	"quantity_unit" VARCHAR(20) NOT NULL,
	PRIMARY KEY ("id")
);