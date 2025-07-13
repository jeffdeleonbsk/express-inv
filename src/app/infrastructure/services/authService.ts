import { IAuthService } from "../../../modules/common/iAuthUserService";
import { signJwt, verifyJwt } from "../jwt/jwt";

export class AuthService implements IAuthService {
  public getUserId(authHeader: string): string | undefined {
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return undefined;
    }
    const payload = verifyJwt(token);
    if (!payload) {
      return undefined;
    }
    return payload.userId;
    }
  public getToken(payload: any): string {
    const realPayload = payload as { userId: string; username: string };
    return signJwt(realPayload);
  }
}
