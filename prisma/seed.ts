import { PrismaClient } from "@prisma/client";
import { setupCities } from "../setup/cities";
import { setupEventTypes } from "../setup/event_types";
import { setupMainSubjects } from "../setup/main_subjects";
import { setupRoles } from "../setup/roles";

const prisma = new PrismaClient();

async function main() {
  // create many roles
  await setupRoles();

  await setupEventTypes();

  await setupMainSubjects();

  await setupCities();
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
