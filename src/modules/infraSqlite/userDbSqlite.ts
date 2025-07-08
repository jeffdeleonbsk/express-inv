import Database from "better-sqlite3";
import { Role } from "../domain/users/models/role";
import { RoleAccess } from "../domain/users/models/roleAccess";
import { User as DomainUser } from "../domain/users/models/user";
import { IUserDb } from "../domain/users/iUserDb";

interface IUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
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
export class UserDbSqlite implements IUserDb {
    private db: any;
    private getStmt: any;
    private getAllStmt: any;
    private addStmt: any;
    private updateStmt: any;
    private deleteStmt: any;
    private beginStmt: any;
    private commitStmt: any;
    private rollbackStmt: any;

    private getRoleStmt: any;
    private getAllRoleAccessStmt: any;

    constructor() {
        const dbName = process.env.SQLITE_DB;
        const db = new Database(dbName);
        db.pragma("journal_mode = WAL");
        this.addStmt = db.prepare<[string, string, string, string, string, string], number>(
            "INSERT INTO users (id, firstname, lastname, email, status, role_code) VALUES (?, ?, ?, ?, ?, ?)"
        );
        this.getStmt = db.prepare<[number], IUser>("SELECT * FROM users WHERE id=?");
        this.getAllStmt = db.prepare<[], IUser>("SELECT * FROM users");
        this.updateStmt = db.prepare<[string, string, string, string, string, string], number>(
            "Update users SET firstname=?, lastname=?, email=?, status=?, role_code=? WHERE id=?"
        );
        this.deleteStmt = db.prepare<[number], number>("DELETE FROM users WHERE id=?");

        this.beginStmt = db.prepare("BEGIN");
        this.commitStmt = db.prepare("COMMIT");
        this.rollbackStmt = db.prepare("ROLLBACK");

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
                ra.can_list>0,
                ra.can_read_own_object>0,
                ra.can_update_own_object>0,
                ra.can_delete_own_object>0,
                ra.can_delete_object>0,
                ra.can_add_object>0,
                ra.can_update_object>0
            );
        });
        return ret;
    }
    public async GetRoleByCode(code: string, loadRoleAccess: boolean = true): Promise<Role|null> {
        const ret: IRole = this.getRoleStmt.get(code);
        if (ret) {
            return new Role(
                ret.code,
                ret.is_active,
                (loadRoleAccess) ? await this.GetRoleAccessesByCode(code) : null
            );
        }
        return null;
    }

    public async GetUserById(
        id: string,
        loadRole: boolean = true,
        loadRoleAccess: boolean = true
    ): Promise<DomainUser> {
        const ret: IUser = this.getStmt.get(id);
        const usr = new DomainUser(
            ret.id,
            ret.firstname,
            ret.lastname,
            ret.email,
            ret.status,
            loadRole ? await this.GetRoleByCode(ret.role_code, loadRoleAccess) : null
        );
        return usr;
    }
    public async GetAllUsers(): Promise<DomainUser[]> {
        return this.getAllStmt.all();
    }
    public async Add(usr: DomainUser): Promise<number> {
        const ret =  this.addStmt.run(usr.id, usr.firstname, usr.lastname, usr.email, usr.status, usr.role!.code);

        return ret.lastInsertRowid;
    }
    public async Update(usr: DomainUser): Promise<number> {
        console.log("User To Update: ", usr);
        const ret =  this.updateStmt.run(usr.firstname, usr.lastname, usr.email, usr.status, usr.role!.code, usr.id);

        return ret.changes;
    }
    public async Delete(usr: DomainUser): Promise<number> {
        this.beginStmt.run();
        const ret = this.deleteStmt.run(usr.id).changes;
        this.commitStmt.run();
        return ret.changes;
    }

}
