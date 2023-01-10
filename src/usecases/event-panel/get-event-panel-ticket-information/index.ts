import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaSubscriptionRepository } from "../../../repositories/implementations/prisma-subscription.respository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { GetEventPanelTicketInformationController } from "./get-event-panel-ticket-information.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketRepository = new PrismaTicketRepository();
const prismaSubscriptionRepository = new PrismaSubscriptionRepository();

export const getEventPanelTicketInformationController =
  new GetEventPanelTicketInformationController(
    prismaEventRepository,
    prismaTicketRepository,
    prismaSubscriptionRepository,
  );
