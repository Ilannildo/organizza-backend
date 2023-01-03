import { PrismaClient } from "@prisma/client";
import { setupCities } from "../setup/cities";
import { setupEventTypes } from "../setup/event-types";
import { setupInstallments } from "../setup/installments";
import { setupMainSubjects } from "../setup/main-subjects";
import { setupRoles } from "../setup/roles";
import { setupSessionTypes } from "../setup/session-types";

const prisma = new PrismaClient();

async function main() {
  // create many roles
  await setupRoles();

  await setupEventTypes();

  await setupMainSubjects();

  await setupCities();

  await setupSessionTypes();

  await setupInstallments();
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
