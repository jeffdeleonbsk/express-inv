import {describe, expect, test} from "@jest/globals";
import { DomainError } from "../../modules/common/domainError";
import { Result } from "../../modules/common/result";
import { Role } from "../../modules/users/domain/role";
import { RoleAccess } from "../../modules/users/domain/roleAccess";
import { RoleResource } from "../../modules/users/domain/roleResource";
import { User } from "../../modules/users/domain/user";

describe("can add valid user", () => {
  test("add a user with a valid role and check role-resource accesses", () => {

    // Hard to read, need to add named parameters
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
    const ra = RoleAccess.createFrom({
      _canList: 0,
      _canAddObject: 0,
      _canUpdateObject: 0,
      _canDeleteObject: 0,
      _canReadOwnObject: 0,
      _canDeleteOwnObject: 0,
      _canUpdateOwnObject: 0,
      _id: 0,
      _roleCode: "ADMIN",
      _reourceCode: "PURCHASES"
    });
    const ra2 = RoleAccess.createFrom({
      _canList: 0,
      _canAddObject: 0,
      _canUpdateObject: 0,
      _canDeleteObject: 0,
      _canReadOwnObject: 1,
      _canDeleteOwnObject: 1,
      _canUpdateOwnObject: 1,
      _id: 0,
      _reourceCode: "USERS",
      _roleCode: "ENCODER"
    });
    try {
      const role = new Role( "ADMIN", 1, [ra, ra2]);
    } catch (err) {
      const domainError = err as DomainError;
      expect(domainError.message).toBe("Cannot add a different role code");
    }

  });
  test("creating role access with inconsistent rule must throw exception", () => {
    // valid
    const ra = RoleAccess.createFrom({
      _canList: 1,
      _canAddObject: 1,
      _canUpdateObject: 1,
      _canDeleteObject: 0,
      _canReadOwnObject: 1,
      _canDeleteOwnObject: 1,
      _canUpdateOwnObject: 1,
      _id: 0,
      _reourceCode: "PURCHASES",
      _roleCode: "ADMIN"
    });
    expect(ra.canAddObject).toBe(true);
    expect(ra.canUpdateObject).toBe(true);
    expect(ra.canDeleteObject).toBe(false);
    expect(ra.canList).toBe(true);

    try {
      // invalid, canList is false but canAdd and canDelete is true, should throw an exception
      const ra2 = RoleAccess.createFrom({
        _canList: 0,
        _canAddObject: 1,
        _canUpdateObject: 0,
        _canDeleteObject: 0,
        _canReadOwnObject: 1,
        _canDeleteOwnObject: 1,
        _canUpdateOwnObject: 1,
        _id: 0,
        _reourceCode: "PURCHASES",
        _roleCode: "ADMIN"
      });
    } catch (err) {
      const domainError = err as DomainError;
      expect(domainError.message).toBe("Add access must be more strict than read access");
    }

  });
});
