import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerFactory from "../../factory/customer.factory";
import Address from "../../value-object/address";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog1WhenCustomerCreatedHandler from "./envia-console-log-1-when-customer-created.handler";
import EnviaConsoleLog2WhenCustomerCreatedHandler from "./envia-console-log-2-when-customer-created.handler";
import EnviaConsoleLogWhenCustomerAddressChangedHandler from "./envia-console-log-when-customer-address-changed.handler";

describe("Customer events tests", () => {

    it("Should notify EnviaConsoleLog1 and EnviaConsoleLog2 handlers when customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const customerCreatedEvent = new CustomerCreatedEvent(
            CustomerFactory.create("Customer name")
        );
        const enviaConsoleLog1Handler = new EnviaConsoleLog1WhenCustomerCreatedHandler();
        const enviaConsoleLog2Handler = new EnviaConsoleLog2WhenCustomerCreatedHandler();
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

    it("Should notify EnviaConsoleLogHandler when customer adress is changed", () => {
        const eventDispatcher = new EventDispatcher();
        const enviaConsoleLogHandler = new EnviaConsoleLogWhenCustomerAddressChangedHandler();
        const spyEventHandler = jest.spyOn(enviaConsoleLogHandler, "handle");
        const customer = CustomerFactory.create("Joao da silva");

        eventDispatcher.register("CustomerAddressChangedEvent", enviaConsoleLogHandler);

        customer.changeAddress(
            new Address("Avenida teste", 1410, "31300-310", "BH")
        );

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: customer.id,
            name: customer.name,
            address: `${customer.Address.street} ${customer.Address.number}, ${customer.Address.city}`
        });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
        
    });
});
