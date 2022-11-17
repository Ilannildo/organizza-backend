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
    skipDuplicates: true,
  });

  const event_types = [
    {
      title: "Jornada ou congresso",
      icon_name: "laptop",
    },
    {
      title: "Festival, Festa ou show",
      icon_name: "music-notes"
    },
  ];

  await prisma.eventType.createMany({
    data: event_types,
    skipDuplicates: true,
  });

  const main_subjects = [
    { title: "Acadêmico e científico" },
    { title: "Desenvolvimento pessoal" },
    { title: "Design e produtos digitais" },
    { title: "Esportes" },
    { title: "Games e Geek" },
    { title: "Gastronomia" },
    { title: "Empreendedorismo, negócios e inovasão" },
    { title: "Governo e política" },
    { title: "Marketing e vendas" },
    { title: "Moda e beleza" },
    { title: "Saúde e bem-estar" },
    { title: "Religião e espiritualidade" },
    { title: "Sociedade e cultura" },
    { title: "Teatro, stand-up e dança" },
  ];

  await prisma.mainSubject.createMany({
    data: main_subjects,
    skipDuplicates: true,
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
