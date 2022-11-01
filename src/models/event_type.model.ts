import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";

export class EventTypeModel {
  public readonly id: string;
  public title: string;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;

  public events?: EventModel[];

  constructor(props: Omit<EventTypeModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
