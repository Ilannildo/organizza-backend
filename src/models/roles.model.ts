import { uuid } from "uuidv4";
import { UserModel } from "./user.model";

export class RoleModel {
  public readonly id: string;
  public name: string;
  public register_user: boolean;
  public delete_user: boolean;
  public edit_user: boolean;
  public view_user: boolean;
  public register_event: boolean;
  public delete_event: boolean;
  public edit_event: boolean;
  public view_event: boolean;
  public created_at: Date;
  public updated_at: Date;
  public user?: UserModel[];

  constructor(props: Omit<RoleModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
