import { TicketPriceTypeModel } from "../../models/ticket-price-type.model";

export interface ITicketPriceTypesRepository {
  findById(eventTypeId: string): Promise<TicketPriceTypeModel>;
  findAll(): Promise<TicketPriceTypeModel[]>;
  save(data: TicketPriceTypeModel): Promise<TicketPriceTypeModel>;
}
