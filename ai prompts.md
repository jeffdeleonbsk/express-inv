based on the create table sql for purchase_orders 
in db_creation.sql, 
implement the getPurchaseOrderById 
function in the file 
src/app/infrastructure/sqlite/purchaseOrderDbSqlite.ts

based on the create table sql for purchase_order_line_items 
in db_creation.sql, 
implement the getLineItemsByPOId 
function in the file 
src/app/infrastructure/sqlite/purchaseOrderDbSqlite.ts


based on the create table sql for purchase_order_line_items 
in db_creation.sql, 
implement the getLineItemsByPOId 
function in the file 
src/app/infrastructure/sqlite/purchaseOrderDbSqlite.ts

based on the create table sql for deliveries 
in db_creation.sql, 
implement the getDeliveriesByLineItemId 
function in the file 
src/app/infrastructure/sqlite/purchaseOrderDbSqlite.ts


based on the create table sql for purchase_orders 
in db_creation.sql, 
implement the getReceivingById
function in the file 
src/app/infrastructure/sqlite/purchaseOrderDbSqlite.ts
map the result to  ReceivingPurchaseOrder 
in src/modules/purchaseOrder/models/PurchaseOrderReceiving.ts

in the file src/modules/purchaseOrder/commands/createPurchaseOrderCmd.ts
create a command for creating a new Purchase Order,
use the function createNew of PurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderCreation.ts
use the file src/modules/users/commands/addUserCmd.ts as reference

create new file src/modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd.ts
in the file src/modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd.ts
create a command for creating adding a line item to an existing PurchaseOrder,
use the function addLineItem of PurchaseOrder 
use the function createNew of PurchaseOrderLineItem
from src/modules/purchaseOrder/models/PurchaseOrderCreation.ts
use the file src/modules/users/commands/activateUser.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/tests/addLineItemsToPO.test.ts
create unit tests for the command AddLineItemToPurchaseOrderCmd
from the file src/modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd.ts
