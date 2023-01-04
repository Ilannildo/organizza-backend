import { CreateTransactionProvider } from "../../../providers/create-transaction.provider";
import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaPaymentMethodRepository } from "../../../repositories/implementations/prisma-payment-method.respository";
import { PrismaServiceOrderRepository } from "../../../repositories/implementations/prisma-service-order.repository";
import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { PrismaTicketServiceOrderRepository } from "../../../repositories/implementations/prisma-ticket-service-order.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { PrismaTransactionRepository } from "../../../repositories/implementations/prisma-transaction.repository";
import { PagarmeGateway } from "../../../services/implementation/pagarme-gateway.service";
import { PayServiceOrderController } from "./pay-service-order.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketRepository = new PrismaTicketRepository();
const prismaSubscriptionRepository = new PrismaSubscriptionRepository();
const prismaServiceOrderRepository = new PrismaServiceOrderRepository();
const prismaTicketServiceOrderRepository =
  new PrismaTicketServiceOrderRepository();
const prismaPaymentMethodRepository = new PrismaPaymentMethodRepository();
const prismaTransactionRepository = new PrismaTransactionRepository();
const pagarmeGatewayService = new PagarmeGateway();
const createTransactionProvider = new CreateTransactionProvider(
  prismaTransactionRepository,
  pagarmeGatewayService
);

export const payServiceOrderController = new PayServiceOrderController(
  prismaTicketRepository,
  prismaSubscriptionRepository,
  prismaEventRepository,
  prismaServiceOrderRepository,
  prismaTicketServiceOrderRepository,
  prismaPaymentMethodRepository,
  createTransactionProvider
);
