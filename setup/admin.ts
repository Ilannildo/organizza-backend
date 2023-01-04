import { PrismaClient } from "@prisma/client";
import { genSaltSync, hash } from "bcryptjs";
import { RoleModel, RolesNames } from "../src/models/roles.model";
const prisma = new PrismaClient();

export const setupadmin = async () => {
  const passwordHash = await hash("123456", genSaltSync(10));
  let defaultRole = await prisma.role.findFirst({
    where: {
      name: RolesNames.ADMIN,
    },
  });
  if (!defaultRole) {
    const newDefaultRole = new RoleModel({
      name: "ADMIN",
      register_user: true,
      delete_user: true,
      edit_user: true,
      view_user: true,
      register_event: true,
      delete_event: true,
      edit_event: true,
      view_event: true,
      delete_service_order: true,
      delete_session: true,
      delete_ticket: true,
      edit_service_order: true,
      edit_session: true,
      edit_ticket: true,
      register_service_order: true,
      register_session: true,
      register_ticket: true,
      view_service_order: true,
      view_session: true,
      view_ticket: true,
    });
    defaultRole = await prisma.role.create({
      data: newDefaultRole,
    });
  }

  await prisma.user.create({
    data: {
      email: "adm.organizza@gmail.com",
      name: "Admin Organiza",
      password: passwordHash,
      role: {
        connect: {
          id: defaultRole.id,
        },
      },
      email_verificated_at: new Date(),
      status: true,
      recipient: {
        create: {
          document: "70181477270",
          document_type: "cpf",
          external_recipient_id: "rp_BpKaGE0uYkfr8zqJ",
          status: "completed",
          account_registered_at: new Date(),
        },
      },
    },
  });
};
