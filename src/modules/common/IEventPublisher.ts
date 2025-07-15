
export interface IEventPublisher {
    init(): Promise<void>;
    publish<T extends object>(eventName: string, eventData: T): Promise<void>;
}
