import { token } from "brandi";
import { IAuthDb } from "../../modules/auth/iAuthDb";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { IEventPublisher } from "../../modules/common/IEventPublisher";
import { IEventSubscriber } from "../../modules/common/IEventSubscriber";
import { IEmailExistsService } from "../../modules/domain/interfaces/iEmailExistsService";
import { IUserAccessService } from "../../modules/domain/interfaces/iUserAccessService";
import { IInventoryDb } from "../../modules/inventory/iInventoryDb";
import { IPurchaseOrderDb } from "../../modules/purchaseOrder/iPurchaseOrderDb";
import { IAddToInventoryService } from "../../modules/purchaseOrder/models/PurchaseOrderReceiving";
import { IUserDb } from "../../modules/users/iUserDb";
import { IAuthorizationDb } from "../../modules/authz/iAuthorizationDb";

const tokenMap = {
    userDb: token<IUserDb>("UserDb"),
    authDb: token<IAuthDb>("AuthDb"),
    authorizationDb: token<IAuthorizationDb>("AuthorizationDb"),
    authService: token<IAuthService>("AuthService"),
    emailExistsService: token<IEmailExistsService>("EmailExistsService"),
    inventoryAddService: token<IAddToInventoryService>("inventoryAddService"),
    inventoryDb: token<IInventoryDb>("inventoryDb"),
    localEventSubscriber: token<IEventSubscriber>("localEventSubscriber"),
    localEventPublisher: token<IEventPublisher>("localEventPublisher"),
    remoteEventSubscriber: token<IEventSubscriber>("remoteEventSubscriber"),
    remoteEventPublisher: token<IEventPublisher>("remoteEventPublisher"),
    userAccessService: token<IUserAccessService>("userAccessService")
};
export default tokenMap;
