import { v4 as uuid } from "uuid";
import { EmailTokenModel } from "./email-token.model";
import { RoleModel } from "./roles.model";

export class UserModel {
  public readonly uid: string;
  public name: string;
  public email: string;
  public gender?: string;
  public phone?: string;
  public password: string;
  public photo_url?: string;
  public name_badge?: string;
  public status: boolean;
  public email_verificated_at?: Date;
  public role_id: string;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;

  public role?: RoleModel;
  public email_token?: EmailTokenModel;

  constructor(props: Omit<UserModel, "uid">, uid?: string) {
    Object.assign(this, props);

    if (!uid) {
      this.uid = uuid();
    }
  }
}
