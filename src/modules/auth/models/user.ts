import * as bcrypt from "bcrypt";
import { DomainError } from "../../common/domainError";
import { UserStatus } from "../../domain/common/enums";
import { Role } from "../../authz/models/role";

// Aggregate Root
export class User {
    public get id(): string {
        return this._id;
    }
    public get firstname(): string {
        return this._firstname;
    }
    public get lastname(): string {
        return this._lastname;
    }
    public get email(): string {
        return this._email;
    }
    public get status(): UserStatus {
        return this._status;
    }
    public get roleCode(): string  {
        return this._roleCode
    }
    public static fromDb(
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        status: UserStatus,
        roleCode: string 
    ) {
        return new User(id, firstname, lastname, email, password, status, roleCode);
    }
    private constructor(
        private _id: string,
        private _firstname: string,
        private _lastname: string,
        private _email: string,
        private _password: string,
        private _status: UserStatus,
        private _roleCode: string 
    ) {
    }
    public isActive(): boolean {
        return this.status.toUpperCase() === UserStatus.ACTIVE;
    }
    public async checkPassword(password: string): Promise<boolean> {
        if (this.isActive() === false) {
            throw new DomainError("Cannot login inactive user");
        }
        return await bcrypt.compare(password, this._password);
    }
}
