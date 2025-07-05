
INSERT INTO roles (code, name, description, is_active) VALUES 
("ADMIN", "Admin", "Super Admin", 1),
("ENCODER", "Encoder", "Encode Data into system",  1),
("PO_ADMIN", "Purchase Order Admin", "Point person in purchasing",  1);

INSERT INTO role_resources (code, name, description, is_active) VALUES 
("USERS", "User Module", "Module for managing users and access roles", 1),
("PURCHASES", "Purchase Order Module", "Module for the Purchase Orders",  1),
("TRANSFERS", "Transfers Module", "Module for managing/tracking transfers between warehouses",  1);


INSERT INTO role_access (
    role_code, resource_code, 
     can_read_own_object, can_update_own_object, can_delete_own_object, 
     can_list, can_add_object, can_update_object, can_delete_object) VALUES 
    (   "ADMIN", "USERS",
        1,1,1,
        1,1,1,1  ),
    (   "ADMIN", "PURCHASES",
        1,1,1,
        1,1,1,1  ),
    (   "ADMIN", "TRANSFERS",
        1,1,1,
        1,1,1,1  ),
    (   "PO_ADMIN", "USERS",
        1,1,1,
        0,0,0,0  ),
    (   "PO_ADMIN", "PURCHASES",
        1,1,1,
        1,1,1,1  ),
    (   "PO_ADMIN", "TRANSFERS",
        0,0,0,
        0,0,0,0  ),
    (   "ENCODER", "USERS",
        1,1,1,
        0,0,0,0  ),
    (   "ENCODER", "PURCHASES",
        1,1,1,
        1,1,1,1  ),
    (   "ENCODER", "TRANSFERS",
        1,1,1,
        1,1,1,1  );

INSERT INTO users (firstname, lastname, email, status, role_code) VALUES
("Admin Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", "ACTIVE", "ADMIN"),
("Encoder Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", "ACTIVE", "ENCODER"),
("PO Admin Jeff", "de Leon ", "jeffdeleonbsk+admin@gmail.com", "ACTIVE", "PO_ADMIN");
