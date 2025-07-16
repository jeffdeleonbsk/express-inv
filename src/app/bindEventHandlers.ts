import { getInstance } from "./common/diContainer";
import TokenMap from "./common/tokenMap";
import { PurchaseOrderDeliveredEventHandler } from "./infrastructure/EventHandlers/PurchaseOrderDeliveredEventHandler";
export async function bindEventHandlers() {
    // This function is used to bind event handlers to the event subscriber.
    // It ensures that the event handlers are registered when the application starts.
    const localPublisher = getInstance(TokenMap.localEventPublisher);
    await localPublisher.init();

    const localSubscriber = getInstance(TokenMap.localEventSubscriber);
    await localSubscriber.init();

    const remotePublisher = getInstance(TokenMap.remoteEventPublisher);
    await remotePublisher.init();

    const remoteSubscriber = getInstance(TokenMap.remoteEventSubscriber);
    await remoteSubscriber.init();

    // Subscribe to PurchaseOrderDeliveredEvent
    localSubscriber.subscribe("PurchaseOrderDeliveredEvent", new PurchaseOrderDeliveredEventHandler());

    console.log("Event handlers bound successfully.");
}
