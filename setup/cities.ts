import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupCities = async () => {
  await prisma.city.create({
    data: {
      name: "Cametá",
      zipcode: "68400000",
      is_available_event: true,
      state: {
        create: {
          name: "Pará",
          uf: "PA",
        },
      },
    },
  });
};
