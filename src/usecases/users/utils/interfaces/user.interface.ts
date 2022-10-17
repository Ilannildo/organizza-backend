import { RoleModel } from "../../../../models/roles.model";

export interface UserDI {
  role?: RoleModel;
  matchesId: (id: string) => boolean;
}