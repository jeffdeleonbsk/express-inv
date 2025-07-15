import { token } from "brandi";
import { IAuthDb } from "../../modules/auth/iAuthDb";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { IEventPublisher } from "../../modules/common/IEventPublisher";
import { IEventSubscriber } from "../../modules/common/IEventSubscriber";
import { IEmailExistsService } from "../../modules/domain/interfaces/iEmailExistsService";
import { IInventoryDb } from "../../modules/inventory/iInventoryDb";
import { IPurchaseOrderDb } from "../../modules/purchaseOrder/iPurchaseOrderDb";
import { IAddToInventoryService } from "../../modules/purchaseOrder/models/PurchaseOrderReceiving";
import { IUserDb } from "../../modules/users/iUserDb";

const tokenMap = {
    userDb: token<IUserDb>("UserDb"),
    authDb: token<IAuthDb>("AuthDb"),
    authService: token<IAuthService>("AuthService"),
    emailExistsService: token<IEmailExistsService>("EmailExistsService"),
    purchaseOrderDb: token<IPurchaseOrderDb>("PurchaseOrderDb"),
    inventoryAddService: token<IAddToInventoryService>("inventoryAddService"),
    inventoryDb: token<IInventoryDb>("inventoryDb"),
    eventSubscriber: token<IEventSubscriber>("eventSubscriber"),
    eventPublisher: token<IEventPublisher>("eventPublisher"),
};
export default tokenMap;
