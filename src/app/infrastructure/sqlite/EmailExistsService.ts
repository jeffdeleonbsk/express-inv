import Database from "better-sqlite3";
import { IEmailExistsService } from "../../../modules/domain/interfaces/iEmailExistsService";

interface IUserCnt {
    cnt: number;
}
export class EmailExistsService implements IEmailExistsService {
    private getStmt: any;
    private db: any;

    public constructor() {
        const dbName = process.env.SQLITE_DB;
        const db = new Database(dbName);
        this.getStmt = db.prepare<[string], IUserCnt>("SELECT COUNT(*) as cnt FROM users WHERE email=?");
        this.db = db;
    }
    public emailExists(email: string): boolean {
        const ret = this.getStmt.get(email);
        return ret.cnt > 0;
    }

}
