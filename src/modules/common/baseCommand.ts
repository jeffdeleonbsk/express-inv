import { Validator } from "node-input-validator";
import { DomainError } from "./domainError";
import { Result } from "./result";

export abstract class BaseCommand<T extends object, U extends object>  {
    protected request: T;
    public constructor(req: T) {
        this.request = req;

    }

    public async execute(): Promise<Result<U>> {
        const retValidation = await this.validate();
        if (retValidation.isSuccess === false) {
            return retValidation;
        }
        try {
            const ret = await this.doCommand();
            if (ret.isSuccess === false) {
                return ret;
            }
            // If the command was successful, publish the event
            this.publishEvent(ret.result);
            return ret;
        } catch (e: any) {
            if (e instanceof DomainError) {
                return Result.domainFailed((e as DomainError).message);
            }
            const err = (e as Error);
            const appErrors =  (err.stack) ? err.stack : err.message;
            return Result.Exception([appErrors], Result.EXCEPTION,   err.message);
        }

    }
    public abstract doCommand(): Promise<Result<U>>;
    protected publishEvent(response: U) {
        // just an empty method to be overridden by subclasses if needed
        // this is where you can publish events or perform actions after command execution
    }

    protected getValidationRules(): any {
        return {};
    }
    protected async validate(): Promise<Result<U>> {
        const validator = new Validator(this.request, this.getValidationRules());
        const matched = await validator.check();
        if (matched) {
          return Result.Ok(null!);
        }
        return Result.validationFailed(validator.errors);
    }
}
