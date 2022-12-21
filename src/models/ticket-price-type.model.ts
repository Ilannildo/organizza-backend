import { v4 as uuid } from "uuid";
import { QuoteModel } from "./quote.model";
import { SessionTicketModel } from "./session-ticket.model";
import { TicketModel } from "./ticket.model";

export class TicketPriceTypeModel {
  public id: string;
  public title: string;
  public quote_id: string;
  public is_free: boolean;
  public created_at?: Date;
  public updated_at?: Date;
  public quote?: QuoteModel;
  public tickets?: TicketModel[];
  public session_tickets?: SessionTicketModel[];

  constructor(props: Omit<TicketPriceTypeModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
