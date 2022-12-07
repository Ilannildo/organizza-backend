import { EventModel } from "./event.model";
import { SessionCoverModel } from "./session_cover.model";
import { SessionTypeModel } from "./session_type.model";

export class SessionModel {
  public readonly id: string;
  title: string;
  credit_hour?: number;
  summary: string;
  responsible_name: string;
  event_id: string;
  session_type_id: string;
  place: string;
  start_date: Date;
  start_time: Date;
  end_date: Date;
  end_time: Date;
  status: "published" | "started" | "finished";
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  event?: EventModel;
  session_cover?: SessionCoverModel;
  session_type?: SessionTypeModel;
}
