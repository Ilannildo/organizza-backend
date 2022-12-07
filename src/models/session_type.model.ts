import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";
import { SessionModel } from "./session.model";

export class SessionTypeModel {
  public readonly id: string;
  public title: string;
  public icon_name?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;

  public sessions?: SessionModel[];

  constructor(props: Omit<SessionTypeModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
