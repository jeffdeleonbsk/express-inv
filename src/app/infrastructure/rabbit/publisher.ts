import amqp from "amqplib";
import { RabbitConnection } from "./rabbitConnection";

export class RabbitPublisher {
    private connection: amqp.ChannelModel | null = null;
    private channel: amqp.Channel | null = null;

    public async connect(url: string) {
        await RabbitConnection.initConnection(url);
        this.connection = RabbitConnection.connection;
        this.channel = await this.connection!.createChannel();
    }

    public async publish(queue: string, message: string) {
        if (!this.channel) { throw new Error("Channel not initialized"); }
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    }

    public async close() {
        await this.channel?.close();
        await this.connection?.close();
    }
}
