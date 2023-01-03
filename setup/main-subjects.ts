import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupMainSubjects = async () => {
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
};
