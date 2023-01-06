import { PrismaInstallmentRepository } from "../../../repositories/implementations/prisma-installment.repository";
import { PrismaPaymentMethodRepository } from "../../../repositories/implementations/prisma-payment-method.respository";
import { PrismaServiceOrderRepository } from "../../../repositories/implementations/prisma-service-order.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { GetInstallmentsController } from "./get-installments.controller";

const prismaPaymentMethodRepository = new PrismaPaymentMethodRepository();
const prismaServiceOrderRepository = new PrismaServiceOrderRepository();
const prismaInstallmentRepository = new PrismaInstallmentRepository();
const prismaTicketRepository = new PrismaTicketRepository();

export const getInstallmentsController = new GetInstallmentsController(
  prismaPaymentMethodRepository,
  prismaServiceOrderRepository,
  prismaInstallmentRepository,
  prismaTicketRepository
);
