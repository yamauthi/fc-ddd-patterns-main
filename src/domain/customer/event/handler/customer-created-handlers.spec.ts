import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerFactory from "../../factory/customer.factory";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1Handler from "./envia-console-log-1-when-customer-created.handler";
import EnviaConsoleLog2Handler from "./envia-console-log-2-when-customer-created.handler";

describe("Customer events tests", () => {

    it("Should notify EnviaConsoleLog1 and EnviaConsoleLog2 handlers when customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const customerCreatedEvent = new CustomerCreatedEvent(
            CustomerFactory.create("Customer name")
        );
        const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(enviaConsoleLog1Handler, "handle");
        const spyEventHandler2 = jest.spyOn(enviaConsoleLog2Handler, "handle");
        
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
        eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
          ).toMatchObject([
              enviaConsoleLog1Handler,
              enviaConsoleLog2Handler
            ]);
        
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();

    });
});
