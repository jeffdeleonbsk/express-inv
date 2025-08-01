import { UserAuthorization } from "./models/userAuthorization";

export interface IAuthorizationDb{
    getUserAuthz(userId: string, resourceCode:string, action:string) : Promise<UserAuthorization|undefined>;
}