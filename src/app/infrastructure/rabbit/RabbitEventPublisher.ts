import amqp from "amqplib";
import { IEventPublisher } from "../../../modules/common/IEventPublisher";
import { RabbitConnection } from "./rabbitConnection";

export class RabbitEventPublisher implements IEventPublisher {
    private url = process.env.RABBIT_URL || "";
    private queue = process.env.RABBIT_QUEUE || "";

    public async init(): Promise<void> {
        await RabbitConnection.initConnection(this.url);
    }
    public async publish<T extends object>(eventName: string, eventData: T): Promise<void> {
        const payload = {eventName, eventData};
        const strData = JSON.stringify(payload);
        await this.publishToQueue(this.queue, strData);
    }
    private async publishToQueue(queue: string, message: string) {
        if (!RabbitConnection.channel) { throw new Error("Channel not initialized"); }
        await RabbitConnection.channel.assertQueue(queue, { durable: true });
        RabbitConnection.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    }
}
