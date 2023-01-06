import { v4 as uuid } from "uuid";
import { SessionTicketServiceOrderModel } from "./session-ticket-service-order.model";
import { TicketServiceOrderModel } from "./ticket-service-order.model";
import { TransactionModel } from "./transaction.model";
import { UserModel } from "./user.model";

export class ServiceOrderModel {
  public readonly id: string;
  public user_id: string;
  public amount_total: number;
  public status: "open" | "processing" | "settled" | "closed" | "canceled";
  public reason_canceled?: string;
  public type: "event" | "session";
  public expires_in: number;
  public paid_at?: Date;
  public created_at?: Date;
  public updated_at?: Date;
  public ticket_service_order?: TicketServiceOrderModel;
  public session_ticket_service_order?: SessionTicketServiceOrderModel;
  public transactions?: TransactionModel[];
  public user?: UserModel;

  constructor(props: Omit<ServiceOrderModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
