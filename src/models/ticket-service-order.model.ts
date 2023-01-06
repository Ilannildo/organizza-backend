import { v4 as uuid } from "uuid";
import { ServiceOrderModel } from "./service-order.model";
import { SubscriptionModel } from "./subscription.model";
import { TicketModel } from "./ticket.model";

export class TicketServiceOrderModel {
  public readonly id: string;
  public service_order_id: string;
  public ticket_id: string;
  public service_order?: ServiceOrderModel;
  public ticket?: TicketModel;
  public subscription?: SubscriptionModel;

  constructor(props: Omit<TicketServiceOrderModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
