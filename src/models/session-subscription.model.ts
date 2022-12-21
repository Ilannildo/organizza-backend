import { v4 as uuid } from "uuid";
import { SessionTicketServiceOrderModel } from "./session-ticket-service-order.model";
import { SessionModel } from "./session.model";
import { UserModel } from "./user.model";

export class SessionSubscriptionModel {
  public readonly id: string;
  public user_id: string;
  public session_id: string;
  public code_ref: string;
  public session_ticket_service_order_id: string;
  public status: "pending" | "processing" | "completed" | "refused";
  public created_at?: Date;
  public updated_at?: Date;

  public user?: UserModel;
  public session?: SessionModel;
  public session_ticket_service_order?: SessionTicketServiceOrderModel;

  constructor(props: Omit<SessionSubscriptionModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
