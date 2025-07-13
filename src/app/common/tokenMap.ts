import { token } from "brandi";
import { IAuthDb } from "../../modules/auth/iAuthDb";
import { IAuthService } from "../../modules/common/iAuthUserService";
import { IEmailExistsService } from "../../modules/domain/interfaces/iEmailExistsService";
import { IPurchaseOrderDb } from "../../modules/purchaseOrder/iPurchaseOrderDb";
import { IUserDb } from "../../modules/users/iUserDb";

const tokenMap = {
    userDb: token<IUserDb>("UserDb"),
    authDb: token<IAuthDb>("AuthDb"),
    authService: token<IAuthService>("AuthService"),
    emailExistsService: token<IEmailExistsService>("EmailExistsService"),
    purchaseOrderDb: token<IPurchaseOrderDb>("PurchaseOrderDb"),
};
export default tokenMap;
