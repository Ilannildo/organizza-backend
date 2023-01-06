import { SessionTypeModel } from "../../models/session-type.model";
import { SessionModel } from "../../models/session.model";

export interface ISessionTypeRepository {
  findAllMenu(): Promise<SessionTypeModel[]>;
  findById(data: { session_type_id: string }): Promise<SessionTypeModel>;
  update(data: SessionModel): Promise<SessionModel>;
  save(data: SessionModel): Promise<SessionModel>;
}
