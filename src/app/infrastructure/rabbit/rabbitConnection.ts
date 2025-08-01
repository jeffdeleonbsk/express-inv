import amqp from "amqplib";

export class RabbitConnection {
    public static connection: amqp.ChannelModel | null = null;

    public static channel: amqp.Channel | null = null;
    public static async initConnection(url: string): Promise<void> {
        if (RabbitConnection.connection === null) {
            this.connection = await amqp.connect(url);
            this.channel = await this.connection!.createChannel();
        }
    }
    public static async close() {
        await this.channel?.close();
        await this.connection?.close();
        this.channel = null;
        this.connection = null;
    }
}
