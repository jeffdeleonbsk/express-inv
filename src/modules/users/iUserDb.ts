import { Role } from "./domain/role";
import { User } from "./domain/user";

export interface IUserDb {
    GetUserByEmail(email: string, loadRole?: boolean, loadRoleAccess?: boolean): Promise<User|null>;
    GetUserById(id: string, loadRole?: boolean, loadRoleAccess?: boolean): Promise<User|null>;
    GetRoleByCode(code: string, loadRoleAccess?: boolean): Promise<Role|null>;
    GetAllUsers(): Promise<User[]>;
    Add(usr: User): Promise<number>;
    Update(usr: User): Promise<number>;
    Delete(usr: User): Promise<number>;
}
