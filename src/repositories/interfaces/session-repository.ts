import { SessionModel } from "../../models/session.model";
import { SubscriptionModel } from "../../models/subscription.model";

export interface ISessionRepository {
  findById(ticket_id: string): Promise<SessionModel>;
  findByEventId(event_id: string): Promise<SessionModel[]>;
  findAllBySessionTypeId(data: {
    sessionTypeId: string;
  }): Promise<SessionModel[]>;
  findAll(): Promise<SessionModel[]>;
  update(data: SessionModel): Promise<SessionModel>;
  save(data: SessionModel): Promise<SessionModel>;
}
