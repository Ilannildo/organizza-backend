import { SessionModel } from "../../models/session.model";

export interface ISessionRepository {
  findById(ticket_id: string): Promise<SessionModel>;
  findByEventId(event_id: string): Promise<SessionModel[]>;
  findAllBySessionTypeId(data: {
    sessionTypeId: string;
  }): Promise<SessionModel[]>;
  findAllBySessionTypeIdPaginate(data: {
    sessionTypeId: string;
    eventId: string;
    page: number;
    limit: number;
  }): Promise<[number, SessionModel[]]>;
  findAll(): Promise<SessionModel[]>;
  update(data: SessionModel): Promise<SessionModel>;
  save(data: SessionModel): Promise<SessionModel>;
}
