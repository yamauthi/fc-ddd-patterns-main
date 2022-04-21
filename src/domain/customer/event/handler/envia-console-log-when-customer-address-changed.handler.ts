import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class EnviaConsoleLogWhenCustomerAddressChangedHandler 
    implements EventHandlerInterface<CustomerAddressChangedEvent> {
    
    handle(event: CustomerAddressChangedEvent): void {
        let customer = event.eventData;
        console.log(
            `Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address}`
        );
    }

}