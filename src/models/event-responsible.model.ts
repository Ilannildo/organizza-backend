import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";

export class EventResponsibleModel {
  public readonly id: string;
  public name: string;
  public email: string;
  public phone?: string;
  public description?: string;
  public logo_url?: string;
  public document?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;

  public events?: EventModel[];

  constructor(props: Omit<EventResponsibleModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
