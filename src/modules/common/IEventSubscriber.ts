
export interface IEventHandler {
    getID(): string;
    handle<T extends object>(eventData: T): void;
}
export interface IEventSubscriber {
    init(): Promise<void>;
    subscribe(eventName: string, callback: IEventHandler): void;
    unsubscribe(eventName: string, id: string): void;
    handlesEventName(eventName: string):boolean;
}
