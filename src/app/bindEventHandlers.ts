import { getInstance } from "./common/diContainer";
import TokenMap from "./common/tokenMap";
import { PurchaseOrderDeliveredEventHandler } from "./infrastructure/nodeEvents/EventHandlers/PurchaseOrderDeliveredEventHandler";
export function bindEventHandlers() {
    // This function is used to bind event handlers to the event subscriber.
    // It ensures that the event handlers are registered when the application starts.
    const eventSubscriber = getInstance(TokenMap.eventSubscriber);
    
    // Subscribe to PurchaseOrderDeliveredEvent
    eventSubscriber.subscribe("PurchaseOrderDeliveredEvent", new PurchaseOrderDeliveredEventHandler());
    
    console.log("Event handlers bound successfully.");
}