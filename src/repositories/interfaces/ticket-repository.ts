import { TicketModel } from "../../models/ticket.model";

export interface ITicketRepository {
  findById(ticket_id: string): Promise<TicketModel>;
  findByEventId(event_id: string): Promise<TicketModel[]>;
  findAll(): Promise<TicketModel[]>;
  update(data: TicketModel): Promise<TicketModel>;
  save(data: TicketModel): Promise<TicketModel>;
}
