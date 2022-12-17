import { v4 as uuid } from "uuid";
import { QuoteModel } from "./quote.model";

export class TicketPriceTypeModel {
  id: string;
  title: string;
  quote_id: string;
  is_free: boolean;

  quote?: QuoteModel;

  constructor(props: Omit<TicketPriceTypeModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
