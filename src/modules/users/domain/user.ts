import { DomainError } from "../../common/domainError";
import { Result } from "../../common/result";
import { Role } from "./role";
import { RoleAccess } from "./roleAccess";
import { RoleResource } from "./roleResource";

// Aggregate Root
export class User {
    public get id(): number {
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
    public get status(): string {
        return this._status;
    }
    public get role(): Role | null {
        return this._role;
    }
    public static createNew(
        id: number,
        firstname: string,
        lastname: string,
        email: string,
        status: string,
        role: Role|null
    ): Result<User> {
        if (role === null) {
            return Result.domainFailed( "Please set the role for this user");
        }
        const user = new User(
            id, firstname, lastname, email, status, role
        );
        return Result.Ok(user);
    }
    public constructor(
        private _id: number,
        private _firstname: string,
        private _lastname: string,
        private _email: string,
        private _status: string,
        private _role: Role | null
    ) {

    }
    public hasReadAccess(resource: RoleResource, ownerId: number = 0): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        if (ra.canList) { return true; }
        return (ra.canReadOwnObject && this._id === ownerId);
    }
    public hasAddAccess(resource: RoleResource, ownerId: number = 0): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        return ra.canAddObject;
    }
    public hasDeleteAccess(resource: RoleResource, ownerId: number = 0): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        if (ra.canDeleteObject) { return true; }
        return (ra.canDeleteOwnObject && this._id === ownerId);
    }
    public hasUpdateAccess(resource: RoleResource, ownerId: number = 0): boolean {
        const ra = this.getAccess(resource.code);
        if (ra === undefined) {
            return false;
        }
        if (ra.canUpdateObject) { return true; }
        return (ra.canUpdateOwnObject && this._id === ownerId);
    }
    public isActive(): boolean {
        return this.status.toUpperCase() === "ACTIVE";
    }
    public updateName(firstName: string, lastName: string) {
        if (this.isActive() === false) {
            throw new DomainError("Cannot edit inactive user");
        }
        this._firstname = firstName;
        this._lastname = lastName;
    }
    private getAccess(resourceCode: string): RoleAccess|undefined {
        if (this._role) {
            return this._role.getRoleAccess(resourceCode);
        }
        return undefined;
    }
}
