import { EventModel } from "./event.model";
import { SessionCoverModel } from "./session_cover.model";
import { SessionTypeModel } from "./session_type.model";

export class SessionModel {
  public readonly id: string;
  public title: string;
  public credit_hour?: number;
  public summary: string;
  public responsible_name: string;
  public event_id: string;
  public session_type_id: string;
  public place: string;
  public start_date: Date;
  public start_time: Date;
  public end_date: Date;
  public end_time: Date;
  public status: "published" | "started" | "finished";
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public event?: EventModel;
  public session_cover?: SessionCoverModel;
  public session_type?: SessionTypeModel;
}
