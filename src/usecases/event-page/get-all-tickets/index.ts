import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { PrismaTicketServiceOrderRepository } from "../../../repositories/implementations/prisma-ticket-service-order.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { GetAllEventPageTicketController } from "./get-all-event-page-tickets.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaSubscriptionRepository = new PrismaSubscriptionRepository();
const prismaTicketRepository = new PrismaTicketRepository();
const prismaTicketServiceOrderRepository =
  new PrismaTicketServiceOrderRepository();
export const getAllEventPageTicketController =
  new GetAllEventPageTicketController(
    prismaEventRepository,
    prismaTicketRepository,
    prismaSubscriptionRepository,
    prismaTicketServiceOrderRepository
  );
