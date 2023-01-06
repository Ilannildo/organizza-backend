import { AddressModel } from "./address.model";
import { EventModel } from "./event.model";

export class EventHasAddressModel {
  public event_id: string;
  public address_id: string;
  public event?: EventModel;
  public address?: AddressModel;

  constructor(props: EventHasAddressModel) {
    Object.assign(this, props);
  }
}
