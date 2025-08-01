import Database from "better-sqlite3";
import { IAuthorizationDb } from "../../../modules/authz/iAuthorizationDb";
import { UserAuthorization } from "../../../modules/authz/models/userAuthorization";
import { stringToUserStatus, UserStatus } from "../../../modules/domain/common/enums";
import { Role } from "../../../modules/authz/models/role";
import { RoleResource } from "../../../modules/authz/models/roleResource";

export class AuthorizationDbSqlite implements IAuthorizationDb {
    private db: any;

    public constructor() {
        const dbName = process.env.SQLITE_DB;
        const db = new Database(dbName);
        this.db = db;
    }
   
    async getUserAuthz(userId: string, resourceCode: string, action: string): Promise<UserAuthorization | undefined> {
        

        const stmt = this.db.prepare(
            `SELECT id, role_code, status FROM
            users WHERE id = ?`
        );
        const userRet = stmt.get(userId);
        if (!userRet) 
            return undefined;

        const stmtRole = this.db.prepare(
            `SELECT code, is_active FROM roles WHERE code=?`
        );    
        const roleRet = stmt.get(userRet.role_code); 
        if (!roleRet) 
            return undefined;   

        const stmtRoleResource = this.db.prepare(
            `SELECT blanket_allow, allow_only_on_owned_resource 
                FROM role_resource_access 
                WHERE resourceCode=? 
                AND action=?
                AND role_code=?
            `
        );    
        const roleResourceRet = stmt.get(resourceCode, action, userRet.role_code); 
        if (!roleResourceRet) 
            return undefined;        
        const isActive = stringToUserStatus(userRet.status) === UserStatus.ACTIVE;
        const user = UserAuthorization.fromDb({
            id: userId,
            isActive: isActive,
            role: Role.fromDb(roleRet.code, roleRet.is_active>0),
            roleResource: RoleResource.fromDb(
                resourceCode, 
                action, 
                roleResourceRet.blanket_allow,
                roleResourceRet.allow_only_on_owned_resource
            )
        });
        return user;
    }
    
}