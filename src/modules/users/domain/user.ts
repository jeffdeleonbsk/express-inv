import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { DomainError } from "../../common/domainError";
import { Result } from "../../common/result";
import { UserStatus } from "../../domain/common/enums";
import { IEmailExistsService } from "../../domain/interfaces/iEmailExistsService";
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
    public get password(): string {
        return this._password;
    }
    public get status(): UserStatus {
        return this._status;
    }
    public get role(): Role | null {
        return this._role;
    }
    public static async createNew(
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        status: UserStatus,
        role: Role|null,
        emailService: IEmailExistsService
    ): Promise<Result<User>> {
        if (emailService.emailExists(email)) {
            return Result.domainFailed( `Email ${email} already exists` );
        }
        if (role === null) {
            return Result.domainFailed( "Please set the role for this user");
        }
        const hash = await bcrypt.hash(password, 10);
        const user = new User(
            uuidv4(), firstname, lastname, email, hash, status, role
        );
        return Result.Ok(user);
    }
    public constructor(
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
        return this.status.toUpperCase() === "ACTIVE";
    }
    public updateName(firstName: string, lastName: string) {
        if (this.isActive() === false) {
            throw new DomainError("Cannot edit inactive user");
        }
        this._firstname = firstName;
        this._lastname = lastName;
    }

    public async updatePassword(oldPass: string, newPass: string, confirmNewPass: string): Promise<void> {
        if (this.isActive() === false) {
            throw new DomainError("Cannot edit inactive user");
        }
        if (confirmNewPass !== newPass) {
            throw new DomainError("COnfirm password does not match new password");
        }
        const confirmOld = await bcrypt.compare(oldPass, this._password);
        if (confirmOld === false) {
            throw new DomainError("Must provide correct old password");
        }
        this._password = await bcrypt.hash(newPass, 10);
    }
    public async checkPassword(password: string): Promise<boolean> {
        if (this.isActive() === false) {
            throw new DomainError("Cannot edit inactive user");
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
