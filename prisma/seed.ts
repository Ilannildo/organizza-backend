import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      name: "ADMIN",
      register_user: true,
      delete_user: true,
      edit_user: true,
      view_user: true,
      register_event: true,
      delete_event: true,
      edit_event: true,
      view_event: true,
    },
    {
      name: "ORGANIZER",
      register_user: false,
      delete_user: false,
      edit_user: true,
      view_user: true,
      register_event: true,
      delete_event: false,
      edit_event: true,
      view_event: true,
    },
    {
      name: "PARTICIPANT",
      register_user: false,
      delete_user: false,
      edit_user: true,
      view_user: true,
      register_event: false,
      delete_event: false,
      edit_event: false,
      view_event: true,
    },
  ];

  await prisma.role.createMany({
    data: roles,
    skipDuplicates: false,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
