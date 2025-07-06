import { DomainError } from "./domainError";
import { ICommandExecutor, IExecutor, IExecutorFactory } from "./executor";
import { Result } from "./result";

export class DefaultExecutor<U extends object> implements IExecutor<U> {
    public async execute(cmd: ICommandExecutor<U>): Promise<Result<U>> {
        try {
            // this is where begin trans
            const ret = await cmd.doCommand();
            if (ret.isSuccess === false) {
                // might need to call rollback
                return ret;
            }
            // this is where end trans
            return ret;
        } catch (e: any) {
            // might need to call rollback
            if (e instanceof DomainError) {
                return Result.domainFailed((e as DomainError).message);
            }
            const err = (e as Error);
            const appErrors =  (err.stack) ? err.stack : err.message;
            return Result.Exception([appErrors], Result.EXCEPTION,   err.message);
        }
    }
}

export class DefaultExecutorFactory implements IExecutorFactory {
    public create<U extends object>(): IExecutor<U> {
        return new DefaultExecutor<U>();
    }
}
