import {describe, expect, test} from "@jest/globals";
import { DomainError } from "../../modules/common/domainError";
import { Result } from "../../modules/common/result";
import { Role } from "../../modules/users/domain/role";
import { RoleAccess } from "../../modules/users/domain/roleAccess";
import { RoleResource } from "../../modules/users/domain/roleResource";
import { User } from "../../modules/users/domain/user";

describe("can add valid user", () => {
  test("add a user with a valid role and check role-resource accesses", () => {

    const ra = new RoleAccess(0, "ADMIN", "PURCHASES", 1, 1, 1, 1, 1, 1, 1);
    const ra2 = new RoleAccess(0, "ADMIN", "USERS", 1, 1, 1, 1, 1, 1, 0);

    const role = new Role( "ADMIN", 1, [ra, ra2]);
    const ret = User.createNew(1, "jeff", "de leon", "jeffdeleonbsk@gmail.com", "active", role);

    expect(ret.isSuccess).toBe(true);

    const user = ret.result;
    const purchases = new RoleResource("PURCHASES", 1);
    expect(user.hasReadAccess(purchases, 2)).toBe(true);
    expect(user.hasDeleteAccess(purchases, 2)).toBe(true);
    const users = new RoleResource("USERS", 1);
    expect(user.hasUpdateAccess(users, 2)).toBe(false);
    expect(user.hasUpdateAccess(users, 1)).toBe(true);
    const transfers = new RoleResource("TRANSFERS", 1);
    expect(user.hasReadAccess(transfers, 2)).toBe(false);
    expect(user.hasUpdateAccess(transfers, 1)).toBe(false);

  });
  test("add role access with different role code from role must throw exception", () => {

    const ra = new RoleAccess(0, "ADMIN", "PURCHASES", 1, 1, 1, 1, 1, 1, 1);
    const ra2 = new RoleAccess(0, "ENCODER", "USERS", 1, 1, 1, 1, 1, 1, 0);
    try {
      const role = new Role( "ADMIN", 1, [ra, ra2]);
    } catch (err) {
      const domainError = err as DomainError;
      expect(domainError.message).toBe("Cannot add a different role code");
    }

  });
  test("creating role access with inconsistent rule must throw exception", () => {
    // valid    
    const ra = new RoleAccess(0, "ADMIN", "PURCHASES", 1, 1, 1, 1, 1, 1, 0);
    expect(ra.canAddObject).toBe(true);
    expect(ra.canUpdateObject).toBe(false);
    expect(ra.canList).toBe(true);
    
    try {
      // invalid, canList is false but canAdd and canDelete is true, should throw an exception
      const ra2 = new RoleAccess(0, "ENCODER", "USERS", 0, 1, 1, 1, 1, 1, 0);
    } catch (err) {
      const domainError = err as DomainError;
      expect(domainError.message).toBe("Add access must be more strict than read access");
    }

  });
});
