import { v4 as uuid } from "uuid";
import { SessionModel } from "./session.model";

export class SessionDatesModel {
  public readonly id: string;
  public date: Date;
  public type: "start" | "end";
  public position: number;
  public status: "started" | "finished";
  public session_id?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public session?: SessionModel;

  constructor(props: Omit<SessionDatesModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
