import amqp from "amqplib";
import { RabbitConnection } from "./rabbitConnection";

export class RabbitSubscriber {
    private connection: amqp.ChannelModel | null = null;
    private channel: amqp.Channel | null = null;

    public async connect(url: string) {
        await RabbitConnection.initConnection(url);
        this.connection = RabbitConnection.connection;
        this.channel = await this.connection!.createChannel();
    }

    public async subscribe(queue: string, onMessage: (msg: any) => void) {
        if (!this.channel) { throw new Error("Channel not initialized"); }
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg) => {
            if (msg) {
                const content = msg.content.toString();
                onMessage(content);
                this.channel!.ack(msg);
            }
        });
    }

    public async close() {
        await this.channel?.close();
        await this.connection?.close();
    }
}
