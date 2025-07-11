import { User } from "./models/user";
export interface IAuthDb {
    GetUserByEmail(email: string): Promise<User|null>;
    GetUserById(id: string): Promise<User|null>;
}
