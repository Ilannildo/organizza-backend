import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaServiceOrderRepository } from "../../../repositories/implementations/prisma-service-order.repository";
import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { PrismaTicketServiceOrderRepository } from "../../../repositories/implementations/prisma-ticket-service-order.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { GetServiceOrderController } from "./get-service-order.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketRepository = new PrismaTicketRepository();
const prismaSubscriptionRepository = new PrismaSubscriptionRepository();
const prismaServiceOrderRepository = new PrismaServiceOrderRepository();
const prismaTicketServiceOrderRepository =
  new PrismaTicketServiceOrderRepository();

export const getServiceOrderController = new GetServiceOrderController(
  prismaTicketRepository,
  prismaSubscriptionRepository,
  prismaEventRepository,
  prismaServiceOrderRepository,
  prismaTicketServiceOrderRepository
);
