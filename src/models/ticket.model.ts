import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";
import { TicketPriceTypeModel } from "./ticket-price-type.model";
import { TicketServiceOrderModel } from "./ticket-service-order.model";

export class TicketModel {
  public id: string;
  public event_id: string;
  public ticket_price_type_id: string;
  public category_title: string;
  public include_fee: boolean;
  public participant_limit: number;
  public description: string;
  public value: number;
  public sold?: number;
  public start_date: Date | null;
  public due_date: Date | null;

  public event?: EventModel;
  public ticket_price_type?: TicketPriceTypeModel;
  public ticket_service_order?: TicketServiceOrderModel[];

  constructor(props: Omit<TicketModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
