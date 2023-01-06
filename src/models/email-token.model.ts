import { v4 as uuid } from "uuid";
import { UserModel } from "./user.model";

export class EmailTokenModel {
  public readonly id: string;
  public expires_in: number;
  public user_id: string;
  public email_sent: boolean;
  public email_sent_at?: Date;
  public created_at?: Date;
  public updated_at?: Date;

  public user?: UserModel;

  constructor(props: Omit<EmailTokenModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
