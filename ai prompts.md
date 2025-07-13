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

create new file src/modules/purchaseOrder/commands/removeLineItemFromPurchaseOrderCmd.ts
in the file src/modules/purchaseOrder/commands/removeLineItemFromPurchaseOrderCmd.ts
create a command for creating removing a line item fram an existing PurchaseOrder,
use the function removeLineItem of PurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderCreation.ts
use the file src/modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/modules/purchaseOrder/commands/cancelPurchaseOrderCmd.ts
in the file src/modules/purchaseOrder/commands/cancelPurchaseOrderCmd.ts
create a command cancelling existing PurchaseOrder,
use the function cancel of PurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderCreation.ts
use the file src/modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/modules/purchaseOrder/commands/confirmPurchaseOrderCmd.ts
in the file src/modules/purchaseOrder/commands/confirmPurchaseOrderCmd.ts
create a command confirming existing PurchaseOrder,
use the function confirm of PurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderCreation.ts
use the file src/modules/purchaseOrder/commands/cancelPurchaseOrderCmd.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/modules/purchaseOrder/commands/receiveDelivery.ts
in the file src/modules/purchaseOrder/commands/receiveDelivery.ts
create a command for receiving deliveries for a confirmed ReceivingPurchaseOrder,
use the function receiveDelivery of ReceivingPurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderReceiving.ts
use the file src/modules/purchaseOrder/commands/addLineItemToPurchaseOrderCmd.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/modules/purchaseOrder/commands/cancelConfirmedOrder.ts
in the file src/modules/purchaseOrder/commands/cancelConfirmedOrder.ts
create a command for cancelling a confirmed ReceivingPurchaseOrder,
use the function cancelOrder of ReceivingPurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderReceiving.ts
use the file src/modules/purchaseOrder/commands/cancelPurchaseOrderCmd.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/app/routes/purchaseOrderRoutes.ts
create api endpoints for the commands in src/modules/purchaseOrder/commands
use src/app/routes/userRoutes.ts as reference

create new file src/modules/purchaseOrder/commands/closeOrder.ts
in the file src/modules/purchaseOrder/commands/closeOrder.ts
create a command for closing a ReceivingPurchaseOrder,
use the function closeOrder of ReceivingPurchaseOrder 
from src/modules/purchaseOrder/models/PurchaseOrderReceiving.ts
use the file src/modules/purchaseOrder/commands/cancelConfirmedOrder.ts as reference
in the request object, use only id's and not the objects as inputs



based on the create table sql for inventory_items in src/database/db_creation.sql
create a better-sqlite3 implementation of IInventoryDb 
in src/modules/inventory/iInventoryDb.ts
create it in src/app/infrastructure/sqlite/InventoryDbSqlite.ts
use src/app/infrastructure/sqlite/purchaseOrderDbSqlite.ts as reference

create new file src/modules/inventory/commands/addToStock.ts
in the file src/modules/inventory/commands/addToStock.ts
create a command for Adding to inventory,
use the function addStock of InventoryEntry 
from src/modules/inventory/models/inventory.ts
use the file src/modules/purchaseOrder/commands/cancelConfirmedOrder.ts as reference
in the request object, use only id's and not the objects as inputs

create new file src/modules/inventory/commands/takeFromStock.ts
in the file src/modules/inventory/commands/takeFromStock.ts
create a command for taking from inventory,
use the function takeStock of InventoryEntry 
from src/modules/inventory/models/inventory.ts
use the file src/modules/inventory/commands/addToStock.ts as reference
in the request object, use only id's and not the objects as inputs