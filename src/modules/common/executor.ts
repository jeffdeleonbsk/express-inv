
import { Result } from "./result";

export interface ICommandExecutor<U extends object> {
    doCommand(): Promise<Result<U>>;
}
export interface IExecutor<U extends object> {
    execute(cmd: ICommandExecutor<U>): Promise<Result<U>>;
}

export interface IExecutorFactory {
    create<U extends object>(): IExecutor<U>;
}
