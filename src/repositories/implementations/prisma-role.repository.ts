import { RoleModel } from "../../models/roles.model";
import { client } from "../../prisma/client";
import { IRolesRepository } from "../interfaces/role-repository";

export class PrismaRoleRepositroy implements IRolesRepository {
  async findById(role_id: string): Promise<RoleModel> {
    const role = await client.role.findFirst({
      where: {
        id: role_id,
      },
    });

    return role;
  }
  async findByName(name: string): Promise<RoleModel> {
    const role = await client.role.findFirst({
      where: {
        name: name,
      },
    });

    return role;
  }

  async findAll(): Promise<RoleModel[]> {
    const roles = await client.role.findMany();

    return roles;
  }
  async save(role: RoleModel): Promise<RoleModel> {
    const roleCreated = await client.role.create({
      data: {
        name: role.name,
        delete_event: role.delete_event,
        delete_user: role.delete_user,
        edit_event: role.edit_event,
        edit_user: role.edit_user,
        register_event: role.register_event,
        register_user: role.register_user,
        updated_at: role.updated_at,
        view_event: role.view_event,
        view_user: role.view_user,
      },
    });
    return roleCreated;
  }
}
