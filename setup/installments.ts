import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setupInstallments = async () => {
  const installments_credit = [
    {
      title: "Crédito em 1x",
      fee: 0.0449,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 2x",
      fee: 0.0647,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 3x",
      fee: 0.0746,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 4x",
      fee: 0.0845,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 5x",
      fee: 0.0944,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 6x",
      fee: 0.1043,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 7x",
      fee: 0.1142,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 8x",
      fee: 0.1241,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 9x",
      fee: 0.1340,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 10x",
      fee: 0.1439,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 11x",
      fee: 0.1538,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
    {
      title: "Crédito em 12x",
      fee: 0.1637,
      payment_method_id: "c4f0953d-a685-42f0-8a6f-d9d3668d6e12"
    },
  ];

  await prisma.installments.createMany({
    data: installments_credit,
    skipDuplicates: true,
  });
};
