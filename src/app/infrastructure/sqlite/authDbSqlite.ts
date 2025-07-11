import Database from "better-sqlite3";
import { IAuthDb } from "../../../modules/auth/iAuthDb";
import { Role } from "../../../modules/auth/models/role";
import { RoleAccess } from "../../../modules/auth/models/roleAccess";
import { User as DomainUser } from "../../../modules/auth/models/user";
import { stringToUserStatus } from "../../../modules/domain/common/enums";

interface IUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    status: string;
    role_code: string;
}
interface IRole {
    code: string;
    is_active: number;
}
interface IRoleAccess {
    id: number;
    role_code: string;
    resource_code: string;
    can_list: number;
    can_read_own_object: number;
    can_update_own_object: number;
    can_delete_own_object: number;
    can_delete_object: number;
    can_add_object: number;
    can_update_object: number;
}
export class AuthDbSqlite implements IAuthDb {
    private db: any;
    private getStmt: any;
    private getByEmailStmt: any;
    private getRoleStmt: any;
    private getAllRoleAccessStmt: any;

    constructor() {
        const dbName = process.env.SQLITE_DB;
        const db = new Database(dbName);
        db.pragma("journal_mode = WAL");

        this.getStmt = db.prepare<[number], IUser>("SELECT * FROM users WHERE id=?");
        this.getByEmailStmt = db.prepare<[string], IUser>("SELECT * FROM users WHERE email=?");

        this.getRoleStmt = db.prepare<[string], IRole>("SELECT code, is_active FROM roles WHERE code=?");
        this.getAllRoleAccessStmt = db.prepare<[string], IRoleAccess>("SELECT * FROM role_access WHERE role_code=?");

        this.db = db;
    }
    public async GetRoleAccessesByCode(code: string): Promise<RoleAccess[]> {
        const retAccess: IRoleAccess[] = this.getAllRoleAccessStmt.all(code);
        const ret = retAccess.map((ra) => {
            return new RoleAccess(
                ra.id,
                ra.role_code,
                ra.resource_code,
                ra.can_list > 0,
                ra.can_read_own_object > 0,
                ra.can_update_own_object > 0,
                ra.can_delete_own_object > 0,
                ra.can_delete_object > 0,
                ra.can_add_object > 0,
                ra.can_update_object > 0
            );
        });
        return ret;
    }
    public async GetRoleByCode(code: string): Promise<Role|null> {
        const ret: IRole = this.getRoleStmt.get(code);
        if (ret) {
            return new Role(
                ret.code,
                ret.is_active,
                await this.GetRoleAccessesByCode(code)
            );
        }
        return null;
    }
    public async GetUserByEmail(
        email: string
    ): Promise<DomainUser|null> {
        const ret: IUser = this.getByEmailStmt.get(email);
        if (!ret) {
            return null;
        }
        const usr = DomainUser.fromDB(
            ret.id,
            ret.firstname,
            ret.lastname,
            ret.email,
            ret.password,
            stringToUserStatus(ret.status),
            await this.GetRoleByCode(ret.role_code)
        );
        return usr;
    }
    public async GetUserById(
        id: string
    ): Promise<DomainUser|null> {
        const ret: IUser = this.getStmt.get(id);
        if (!ret) {
            return null;
        }
        const usr = DomainUser.fromDB(
            ret.id,
            ret.firstname,
            ret.lastname,
            ret.email,
            ret.password,
            stringToUserStatus(ret.status),
            await this.GetRoleByCode(ret.role_code)
        );
        return usr;
    }
}
