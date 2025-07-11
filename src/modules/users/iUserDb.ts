import { Role } from "./models/role";
import { User } from "./models/user";

export interface IUserDb {
    GetUserByEmail(email: string): Promise<User|null>;
    GetUserById(id: string): Promise<User|null>;
    GetRoleByCode(code: string): Promise<Role|null>;
    GetAllUsers(): Promise<User[]>;
    Add(usr: User): Promise<number>;
    Update(usr: User): Promise<number>;
    Delete(usr: User): Promise<number>;
}
