import Database from "better-sqlite3";
import { stringToUserStatus } from "../../../modules/domain/common/enums";
import { IUserDb } from "../../../modules/users/iUserDb";
import { Role } from "../../../modules/users/models/role";
import { User as DomainUser } from "../../../modules/users/models/user";

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

export class UserDbSqlite implements IUserDb {
    private db: any;
    private getStmt: any;
    private getByEmailStmt: any;
    private getAllStmt: any;
    private addStmt: any;
    private updateStmt: any;
    private deleteStmt: any;
    private beginStmt: any;
    private commitStmt: any;
    private rollbackStmt: any;

    private getRoleStmt: any;

    constructor() {
        const dbName = process.env.SQLITE_DB;
        const db = new Database(dbName);
        db.pragma("journal_mode = WAL");
        this.addStmt = db.prepare<[string, string, string, string, string, string, string], number>(
            "INSERT INTO users (id, firstname, lastname, email, password, status, role_code) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        this.getStmt = db.prepare<[number], IUser>("SELECT * FROM users WHERE id=?");
        this.getByEmailStmt = db.prepare<[string], IUser>("SELECT * FROM users WHERE email=?");
        this.getAllStmt = db.prepare<[], IUser>("SELECT * FROM users");
        this.updateStmt = db.prepare<[string, string, string, string, string, string, string], number>(
            "Update users SET firstname=?, lastname=?, email=?, password=?, status=?, role_code=? WHERE id=?"
        );
        this.deleteStmt = db.prepare<[number], number>("DELETE FROM users WHERE id=?");

        this.beginStmt = db.prepare("BEGIN");
        this.commitStmt = db.prepare("COMMIT");
        this.rollbackStmt = db.prepare("ROLLBACK");

        this.getRoleStmt = db.prepare<[string], IRole>("SELECT code, is_active FROM roles WHERE code=?");
        this.db = db;
    }
    public async GetRoleByCode(code: string, loadRoleAccess: boolean = true): Promise<Role|null> {
        const ret: IRole = this.getRoleStmt.get(code);
        if (ret) {
            return new Role(
                ret.code,
                ret.is_active
            );
        }
        return null;
    }
public async GetUserByEmail(
        email: string,
        loadRole: boolean = true,
        loadRoleAccess: boolean = true
    ): Promise<DomainUser|null> {
        const ret: IUser = this.getByEmailStmt.get(email);
        if (!ret) {
            return null;
        }
        const usr = new DomainUser(
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
    ): Promise<DomainUser| null> {
        const ret: IUser = this.getStmt.get(id);
        if (!ret) {
            return null;
        }
        const usr = new DomainUser(
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
    public async GetAllUsers(): Promise<DomainUser[]> {
        return this.getAllStmt.all();
    }
    public async Add(usr: DomainUser): Promise<number> {
        const ret =  this.addStmt.run(usr.id, usr.firstname, usr.lastname, usr.email, usr.password, usr.status, usr.role!.code);
        return ret.lastInsertRowid;
    }
    public async Update(usr: DomainUser): Promise<number> {
        const ret =  this.updateStmt.run(usr.firstname, usr.lastname, usr.email, usr.password, usr.status, usr.role!.code, usr.id);
        return ret.changes;
    }
    public async Delete(usr: DomainUser): Promise<number> {
        this.beginStmt.run();
        const ret = this.deleteStmt.run(usr.id).changes;
        this.commitStmt.run();
        return ret.changes;
    }
}
