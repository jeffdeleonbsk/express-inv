
export class DomainError extends Error {
    public constructor(
        private _message: string
    ) {
        super();
    }
    public get message(): string {
        return this._message;
    }
}
