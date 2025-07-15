import { IEventHandler, IEventSubscriber } from "../../../modules/common/IEventSubscriber";
import { myEmitter } from "./EventPublisher";

export class EventSubscriber implements IEventSubscriber {
    private listeners: Map<string, IEventHandler[]> = new Map();
    constructor() {
        // Initialize the event emitter listeners
        myEmitter.on("error", (err) => {
            console.error("EventEmitter error:", err);
        });
    }
    public subscribe(eventName: string, callback: IEventHandler): void {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
            console.log(`Subscribed to event: ${eventName}`);
            myEmitter.on(eventName, (data: string) => {
                const parsedData = JSON.parse(data);
                this.listeners.get(eventName)?.forEach((handler) => {
                    handler.handle(parsedData);
                });
            });
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
}
