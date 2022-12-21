import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";
import { TicketServiceOrderModel } from "./ticket-service-order.model";
import { UserModel } from "./user.model";

export class SubscriptionModel {
  public readonly id: string;
  public user_id: string;
  public event_id: string;
  public code_ref: string;
  public ticket_service_order_id: string;
  public status: "pending" | "processing" | "completed" | "refused";
  public created_at?: Date;
  public updated_at?: Date;

  public user?: UserModel;
  public event?: EventModel;
  public ticket_service_order?: TicketServiceOrderModel;

  constructor(props: Omit<SubscriptionModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
