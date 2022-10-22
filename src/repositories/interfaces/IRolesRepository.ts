import { RoleModel } from "../../models/roles.model";

export interface IRolesRepository {
  findById(role_id: string): Promise<RoleModel>;
  findByName(name: string): Promise<RoleModel>;
  findAll(): Promise<RoleModel[]>;
  save(role: RoleModel): Promise<RoleModel>;
}