import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { EventGeneralInformation } from "./event-general-information.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketRepository = new PrismaTicketRepository();

export const eventGeneralInformation = new EventGeneralInformation(
  prismaEventRepository,
  prismaTicketRepository
);
