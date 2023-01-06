import { v4 as uuid } from "uuid";
import { ServiceOrderModel } from "./service-order.model";
import { SessionSubscriptionModel } from "./session-subscription.model";
import { SessionTicketModel } from "./session-ticket.model";

export class SessionTicketServiceOrderModel {
  public readonly id: string;
  public service_order_id: string;
  public session_ticket_id: string;
  public service_order?: ServiceOrderModel;
  public session_ticket?: SessionTicketModel;
  public session_subscription?: SessionSubscriptionModel;

  constructor(props: Omit<SessionTicketServiceOrderModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
