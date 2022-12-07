import { v4 as uuid } from "uuid";
import { EventModel } from "./event.model";
import { SessionModel } from "./session.model";

export class SessionCoverModel {
  public readonly id: string;
  public session_id: string;
  public name: string;
  public size: number;
  public key: string;
  public url?: string;

  public session?: SessionModel;

  constructor(props: Omit<SessionCoverModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
