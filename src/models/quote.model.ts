
import { v4 as uuid } from "uuid";
import { TicketPriceTypeModel } from "./ticket-price-type.model";

export class QuoteModel {
  public id: string;
  public name: string;
  public percentage: number;
  public min_value: number;
  public min_base_value: number;
  public created_at?: Date;
  public updated_at?: Date;
  public ticket_price_types?: TicketPriceTypeModel[];

  constructor(props: Omit<QuoteModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
