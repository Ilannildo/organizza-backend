import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupEventTypes = async () => {
  const event_types = [
    {
      title: "Jornada ou congresso",
      icon_name: "laptop",
    },
    {
      title: "Festival, Festa ou show",
      icon_name: "music-notes",
    },
  ];

  await prisma.eventType.createMany({
    data: event_types,
    skipDuplicates: true,
  });
};
