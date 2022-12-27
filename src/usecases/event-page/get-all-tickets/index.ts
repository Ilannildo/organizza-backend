import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { GetAllEventPageTicketController } from "./get-all-event-page-tickets.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaSubscriptionRepository = new PrismaSubscriptionRepository();
const prismaTicketRepository = new PrismaTicketRepository();
export const getAllEventPageTicketController =
  new GetAllEventPageTicketController(
    prismaEventRepository,
    prismaTicketRepository,
    prismaSubscriptionRepository
  );
