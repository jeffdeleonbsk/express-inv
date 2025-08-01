import Database from "better-sqlite3";
import { IAuthDb } from "../../../modules/auth/iAuthDb";
import { Role } from "../../../modules/authz/models/role";
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
        this.db = db;
    }
  

    public async GetUserByEmail(
        email: string
    ): Promise<DomainUser|null> {
        const ret: IUser = this.getByEmailStmt.get(email);
        if (!ret) {
            return null;
        }
        const usr = DomainUser.fromDb(
            ret.id,
            ret.firstname,
            ret.lastname,
            ret.email,
            ret.password,
            stringToUserStatus(ret.status),
            ret.role_code
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
        const usr = DomainUser.fromDb(
            ret.id,
            ret.firstname,
            ret.lastname,
            ret.email,
            ret.password,
            stringToUserStatus(ret.status),
            ret.role_code
        );
        return usr;
    }
}
