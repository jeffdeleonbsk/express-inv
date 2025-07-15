import { EventEmitter } from "events";
import { IEventPublisher } from "../../../modules/common/IEventPublisher";

export const myEmitter = new EventEmitter();

export class EventPublisher implements IEventPublisher {
    public async init(): Promise<void> {
    }
    public async publish<T extends object>(eventName: string, eventData: T): Promise<void> {
        const strData = JSON.stringify(eventData);
        myEmitter.emit(eventName, strData);
    }
}
