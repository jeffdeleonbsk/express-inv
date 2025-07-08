CREATE TABLE "users" (
	"id" VARCHAR(40) NOT NULL,
	"firstname" VARCHAR(255) NULL,
	"lastname" VARCHAR(255) NULL,
	"email" VARCHAR(255) NULL,
	"status" VARCHAR(255) NULL,
	"role_code" VARCHAR(20) NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "roles" (
	"code" VARCHAR(20) NULL,
	"name" VARCHAR(50) NULL,
	"description" VARCHAR(50) NULL,
	"is_active" INTEGER NULL,
	PRIMARY KEY ("code")
);
CREATE TABLE "role_access" (
	"id" VARCHAR(40) NOT NULL,
	"role_code" VARCHAR(20) NULL,	
	"resource_code" VARCHAR(20) NULL,
	"can_list" TINYINT NULL,
	"can_read_own_object" TINYINT NULL,
	"can_update_own_object" TINYINT NULL,
	"can_delete_own_object" TINYINT NULL,
	"can_delete_object" TINYINT NULL,
	"can_add_object" TINYINT NULL,
	"can_update_object" TINYINT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "role_resources" (
	"code" VARCHAR(20) NULL,
	"name" VARCHAR(50) NULL,
	"description" VARCHAR(50) NULL,
	"is_active" INTEGER NULL,
	PRIMARY KEY ("code")
);