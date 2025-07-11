import { Role } from "./models/role";
import { User } from "./models/user";

export interface IUserDb {
    GetUserById(id: string, loadRole?: boolean, loadRoleAccess?: boolean): Promise<User|null>;
    GetRoleByCode(code: string, loadRoleAccess?: boolean): Promise<Role|null>;
    GetAllUsers(): Promise<User[]>;
    Add(usr: User): Promise<number>;
    Update(usr: User): Promise<number>;
    Delete(usr: User): Promise<number>;
}
