import { TicketModel } from "../../models/ticket.model";

export interface ITicketRepository {
  findById(ticket_id: string): Promise<TicketModel>;
  findByEventId(event_id: string): Promise<TicketModel[]>;
  findByEventIdPaginate(data: {
    eventId: string;
    page: number;
    limit: number;
  }): Promise<[number, TicketModel[]]>;
  findAll(): Promise<TicketModel[]>;
  update(data: TicketModel): Promise<TicketModel>;
  save(data: TicketModel): Promise<TicketModel>;
}
