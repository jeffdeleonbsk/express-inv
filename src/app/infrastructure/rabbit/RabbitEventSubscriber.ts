import amqp from "amqplib";
import { IEventHandler, IEventSubscriber } from "../../../modules/common/IEventSubscriber";
import { RabbitConnection } from "./rabbitConnection";

export class RabbitEventSubscriber implements IEventSubscriber {
    private listeners: Map<string, IEventHandler[]> = new Map();
    private url = process.env.RABBIT_URL || "";
    private queue = process.env.RABBIT_QUEUE || "";

    public async init(): Promise<void> {
        await RabbitConnection.initConnection(this.url);
        const _self = this;
        await this.subscribeToQueue(this.queue, (msg: any) => {
            const {eventName, eventData} = JSON.parse(msg);
            if (_self.listeners.has(eventName)) {
                _self.listeners?.get(eventName)?.forEach((l) => {
                    l.handle(eventData);
                });
            }
        });
    }
    public handlesEventName(eventName: string): boolean {
        return this.listeners.has(eventName);
    }
    public subscribe(eventName: string, callback: IEventHandler): void {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        const idx = this.listeners.get(eventName)?.findIndex((h) => h.getID() === callback.getID()) ;
        if (idx === undefined || idx < 0) {
            this.listeners.get(eventName)?.push(callback);
        } else {
            this.listeners.get(eventName)![idx] = callback; // Update existing handler
        }
    }

    public unsubscribe(eventName: string, id: string): void {
        if (!this.listeners.has(eventName)) {
            return;
        }
        const idx = this.listeners.get(eventName)?.findIndex((h) => h.getID() === id);
        if (idx !== undefined && idx >= 0) {
            this.listeners.get(eventName)?.splice(idx, 1);
        }
    }
    private async subscribeToQueue(queue: string, onMessage: (msg: any) => void) {
        if (!RabbitConnection.channel) { throw new Error("Channel not initialized"); }
        await RabbitConnection.channel.assertQueue(queue, { durable: true });
        RabbitConnection.channel.consume(queue, (msg) => {
            if (msg) {
                const content = msg.content.toString();
                onMessage(content);
                RabbitConnection.channel!.ack(msg);
            }
        });
    }
}
