import { Validator } from "node-input-validator";
import { DefaultExecutor } from "./DefaultExecutor";
import { ICommandExecutor, IExecutor } from "./executor";
import { Result } from "./result";

export abstract class BaseCommand<T extends object, U extends object> implements ICommandExecutor<U> {
    protected request: T;
    private executor?: IExecutor<U>;
    public constructor(req: T, executor?: IExecutor<U>) {
        this.request = req;
        if (executor) {
            this.executor = executor;
        } else {
            this.executor = new DefaultExecutor();
        }
    }

    public async execute(): Promise<Result<U>> {
        const retValidation = await this.validate();
        if (retValidation.isSuccess === false) {
            return retValidation;
        }
        if (this.executor) {
            return await this.executor.execute(this);
        }

        return await this.doCommand();
    }
    public abstract doCommand(): Promise<Result<U>>;

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
