import { SessionTicketModel } from "../../models/session-ticket.model";

export interface ISessionTicketRepository {
  findById(ticket_id: string): Promise<SessionTicketModel>;
  findBySessionId(session_id: string): Promise<SessionTicketModel[]>;
  findBySessionIdPaginate(data: {
    sessionId: string;
    page: number;
    limit: number;
  }): Promise<[number, SessionTicketModel[]]>;
  findAll(): Promise<SessionTicketModel[]>;
  update(data: SessionTicketModel): Promise<SessionTicketModel>;
  save(data: SessionTicketModel): Promise<SessionTicketModel>;
}
