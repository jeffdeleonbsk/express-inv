import * as bcrypt from "bcrypt";
import { DomainError } from "../../common/domainError";
import { UserStatus } from "../../domain/common/enums";
import { Role } from "./role";
import { RoleAccess } from "./roleAccess";
import { RoleResource } from "./roleResource";

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
        if (this._role) {
            return this._role.code;
        }
        return "";
    }
    public static fromDB(
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        status: UserStatus,
        role: Role | null
    ) {
        return new User(id, firstname, lastname, email, password, status, role);
    }
    private constructor(
        private _id: string,
        private _firstname: string,
        private _lastname: string,
        private _email: string,
        private _password: string,
        private _status: UserStatus,
        private _role: Role | null
    ) {
    }
    public hasReadAccess(resource: RoleResource, ownerId: string): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        if (ra.canList) { return true; }
        return (ra.canReadOwnObject && this._id === ownerId);
    }
    public hasAddAccess(resource: RoleResource, ownerId: string): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        return ra.canAddObject;
    }
    public hasDeleteAccess(resource: RoleResource, ownerId: string): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        if (ra.canDeleteObject) { return true; }
        return (ra.canDeleteOwnObject && this._id === ownerId);
    }
    public hasUpdateAccess(resource: RoleResource, ownerId: string): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        if (ra.canUpdateObject) { return true; }
        return (ra.canUpdateOwnObject && this._id === ownerId);
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
    private getAccess(resourceCode: string): RoleAccess|undefined {
        if (this._role) {
            return this._role.getRoleAccess(resourceCode);
        }
        return undefined;
    }
}
