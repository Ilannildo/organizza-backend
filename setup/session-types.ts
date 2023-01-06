import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupSessionTypes = async () => {
  const data = [
    {
      title: "Palestras",
      is_active: true,
      is_menu: true,
    },
    {
      title: "Cursos",
      is_active: true,
      is_menu: true,
    },
    {
      title: "Geral",
      is_active: true,
      is_menu: false,
    },
    {
      title: "Mesas Redondas",
      is_active: true,
      is_menu: true,
    },
  ];

  await prisma.sessionType.createMany({
    data,
    skipDuplicates: true,
  });
};
