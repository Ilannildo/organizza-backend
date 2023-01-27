import { v4 as uuid } from "uuid";
import { SessionTicketServiceOrderModel } from "./session-ticket-service-order.model";
import { SessionModel } from "./session.model";
import { TicketPriceTypeModel } from "./ticket-price-type.model";

export class SessionTicketModel {
  public id: string;
  public session_id: string;
  public ticket_price_type_id: string;
  public participant_limit: number;
  public value: number;
  public created_at?: Date;
  public updated_at?: Date;
  public session?: SessionModel;
  public ticket_price_type?: TicketPriceTypeModel;
  public session_ticket_service_orders?: SessionTicketServiceOrderModel[];

  constructor(props: Omit<SessionTicketModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
