
export interface IEventPublisher {
    publish<T extends object>(eventName: string, eventData: T): Promise<void>;
}
