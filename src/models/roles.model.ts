import { v4 as uuid } from "uuid";
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
  public register_ticket: boolean;
  public delete_ticket: boolean;
  public edit_ticket: boolean;
  public view_ticket: boolean;
  public register_session: boolean;
  public delete_session: boolean;
  public edit_session: boolean;
  public view_session: boolean;
  public register_service_order: boolean;
  public delete_service_order: boolean;
  public edit_service_order: boolean;
  public view_service_order: boolean;
  public created_at?: Date;
  public updated_at?: Date;
  public user?: UserModel[];

  constructor(props: Omit<RoleModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}

export enum RolesNames {
  "ADMIN" = "ADMIN",
  "ORGANIZER" = "ORGANIZER",
  "PARTICIPANT" = "PARTICIPANT",
}
