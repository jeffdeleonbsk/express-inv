# Express Inventory & Purchase Order System (TypeScript, DDD)

## Overview
This project is an exercise in using **Domain Driven Design (DDD)** to create a simple but non-trivial application. The chosen problem is making purchase orders for an inventory system. The intent is not to create a full featured system. Rather, the intent is to show how to create an application following **Domain Driven Design (DDD)** principles in Typescript. It demonstrates how to structure a real-world Node.js application using DDD, CQRS, and strong typing, Inversion of Control(Dependency Inversion), with a focus on maintainability, testability, and clear separation of concerns.

- **Database:** SQLite (via better-sqlite3)
- **Authentication:** JWT
- **Testing:** Jest
- **IoC Container:** Brandi
- **Patterns:** DDD, CQRS, Command Pattern, Repository Pattern, Value Objects, Entities

---

## Key Features
- User, Role, and Access Management
- Purchase Order lifecycle: Create, Confirm, Add/Remove Line Items, Cancel, Receive Delivery, Close
- Inventory management: Add to stock, Take from stock
- IoC using Brandi. 
- Modular, testable, and extensible codebase

---

## Domain Driven Design (DDD) in This Project
- **Domain Models** are in `src/modules/purchaseOrder/models/` and `src/modules/inventory/models/`.
- **Commands** encapsulate all business actions (see `src/modules/purchaseOrder/commands/` and `src/modules/inventory/commands/`).
- **Repositories** abstract persistence (see `src/app/infrastructure/sqlite/`).
- **Value Objects** and **Entities** are used throughout the domain layer.
- **CQRS**: Commands are separated from queries, and all state changes go through command handlers.


**Navigate the Domain:**
- Purchase Order models: [`src/modules/purchaseOrder/models/PurchaseOrderCreation.ts`](src/modules/purchaseOrder/models/PurchaseOrderCreation.ts), [`PurchaseOrderReceiving.ts`](src/modules/purchaseOrder/models/PurchaseOrderReceiving.ts), [`PurchaseOrderLineItem.ts`](src/modules/purchaseOrder/models/PurchaseOrderLineItem.ts)
- Inventory models: [`src/modules/inventory/models/inventory.ts`](src/modules/inventory/models/inventory.ts)
- Value Objects: [`src/modules/domain/common/genericValueObjects.ts`](src/modules/domain/common/genericValueObjects.ts), [`src/modules/domain/common/domainValueObjects.ts`](src/modules/domain/common/domainValueObjects.ts)

---

**Navigate the App Layer:**
- API routes: [`src/app/routes`](src/app/routes)
- IoC Service/Repository Binding: [`src/app/bindToContainer.ts`](src/app/bindToContainer.ts), [`src/app/common/tokenMap.ts`](src/app/common/tokenMap.ts), [`src/app/common/diContainer.ts`](src/app/common/diContainer.ts)
- Middlewares: [`src/app/middlewares`](src/app/middlewares)
- Repository Implementations (SQLite): [`src/app/infrastructure/sqlite`](src/app/infrastructure/sqlite)
- Service Implementations: [`src/app/infrastructure/services`](src/app/infrastructure/services)

---

## Workflow: Purchase Order & Inventory

### 1. Purchase Order Lifecycle
- **Create PO:**
  - Use `CreatePurchaseOrderCmd` to create a new PO (see `src/modules/purchaseOrder/commands/createPurchaseOrderCmd.ts`).
- **Add Line Items:**
  - Use `AddLineItemToPurchaseOrderCmd` to add products to the PO.
- **Confirm PO:**
  - Use `ConfirmPurchaseOrderCmd` to confirm the PO for processing.
- **Cancel/Remove Line Items:**
  - Use `RemoveLineItemFromPurchaseOrderCmd` or `CancelPurchaseOrderCmd` as needed.
- **Receive Delivery:**
  - Use `ReceiveDeliveryCmd` to record deliveries against confirmed POs.
- **Close PO:**
  - Use `CloseOrderCmd` to close a PO when all items are delivered or cancelled.

### 2. Inventory Management
- **Add to Stock:**
  - Use `AddToStockCmd` to increase inventory for a product/warehouse.
- **Take from Stock:**
  - Use `TakeFromStockCmd` to decrease inventory for a product/warehouse.
- **Inventory is updated automatically** when deliveries are received via the PO workflow.

---

## Project Structure
- `src/modules/purchaseOrder/models/` — Domain models for purchase orders
- `src/modules/purchaseOrder/commands/` — Command handlers for all PO actions
- `src/modules/inventory/models/` — Domain models for inventory
- `src/modules/inventory/commands/` — Command handlers for inventory actions
- `src/app/infrastructure/sqlite/` — Repository implementations (better-sqlite3)
- `src/app/routes/` — Express route handlers (API endpoints)
- `src/database/` — SQL schema and seeders
- `src/tests/` — Jest unit tests

---

## Getting Started
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up environment:**
   - Copy `.env.example` to `.env` and set `SQLITE_DB=sample.sqlite`
3. **Run database seeders:**
   ```sh
   ts-node src/database/seeder.ts
   ```
4. **Start the server:**
   ```sh
   npm run dev
   ```
5. **Run tests:**
   ```sh
   npm test
   ```

---

## Extending the Domain
- Add new commands in the appropriate `commands/` folder.
- Add new domain logic in the `models/` folder.
- Add new persistence logic in the `infrastructure/sqlite/` folder.

---

## Contributing
- Follow DDD and CQRS patterns for all new features.
- Write unit tests for all new commands and domain logic.
- Keep business logic out of controllers/routes.

---

## License
MIT


