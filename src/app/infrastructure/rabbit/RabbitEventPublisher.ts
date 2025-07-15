import { IEventPublisher } from "../../../modules/common/IEventPublisher";
import { RabbitPublisher } from "./publisher";

export class RabbitEventPublisher implements IEventPublisher {
    private rabbitPublisher: RabbitPublisher|null = null;
    private url = process.env.RABBIT_URL || "";
    private queue = process.env.RABBIT_QUEUE || "";
    public constructor() {
        this.rabbitPublisher = new RabbitPublisher();
    }

    public async init(): Promise<void> {
        if (this.rabbitPublisher) {
            await this.rabbitPublisher.connect(this.url);
        } else {
            throw new Error("RabbitPublisher is not initialized.");
        }
    }

    public async publish<T extends object>(eventName: string, eventData: T): Promise<void> {

        const payload = {
            eventName,
            eventData
        };
        const strData = JSON.stringify(payload);
        await this.rabbitPublisher?.publish(this.queue, strData);
    }
}
