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