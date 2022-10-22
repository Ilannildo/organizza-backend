import { v4 as uuid } from "uuid";
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
  public role_id: string;
  public email_verificated_at?: Date;
  public created_at?: Date;
  public updated_at?: Date;
  public deleted_at?: Date;

  public role?: RoleModel;

  constructor(props: Omit<UserModel, "uid">, uid?: string) {
    Object.assign(this, props);

    if (!uid) {
      this.uid = uuid();
    }
  }
}
