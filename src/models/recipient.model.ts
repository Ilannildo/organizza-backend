import { v4 as uuid } from "uuid";
import { UserModel } from "./user.model";

export class RecipientModel {
  public id: string;
  public user_id: string;
  public external_recipient_id: string;
  public document: string;
  public document_type: "cpf" | "cnpj";
  public status: "pending" | "refused" | "completed" | "canceled";
  public account_registered_at?: Date;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;
  public user?: UserModel;

  constructor(props: Omit<RecipientModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
