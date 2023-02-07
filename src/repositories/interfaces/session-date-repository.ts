import { SessionDatesModel } from "../../models/session-date.model";

export interface ISessionDateRepository {
  findAllMenu(): Promise<SessionDatesModel[]>;
  findById(data: { session_type_id: string }): Promise<SessionDatesModel>;
  findByEventId(data: { event_id: string }): Promise<SessionDatesModel[]>;
  update(data: SessionDatesModel): Promise<SessionDatesModel>;
  save(data: SessionDatesModel): Promise<SessionDatesModel>;
}
