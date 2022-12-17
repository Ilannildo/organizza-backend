import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";

export class EventCoverModel {
  public readonly id: string;
  public event_id: string;
  public name: string;
  public size: number;
  public key: string;
  public url?: string;

  public event?: EventModel;

  constructor(props: Omit<EventCoverModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
