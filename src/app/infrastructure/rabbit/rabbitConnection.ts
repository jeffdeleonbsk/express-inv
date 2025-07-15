import amqp from "amqplib";

export class RabbitConnection {
    public static connection: amqp.ChannelModel | null = null;
    public static async initConnection(url: string): Promise<void> {
        if (RabbitConnection.connection === null) {
            this.connection = await amqp.connect(url);
        }
    }
}
