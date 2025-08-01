import { DomainError } from "../../common/domainError";

// Value Object
export class Role {
    public static fromDb(
        code: string,
        isActive: boolean        
    ){
        return new Role(code, isActive);
    }
    private constructor(
        public readonly code: string,
        public readonly isActive: boolean
    ) {
    }
}
