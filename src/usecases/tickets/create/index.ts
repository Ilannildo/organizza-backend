import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { CreateTicketController } from "./create-ticket.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketRepository = new PrismaTicketRepository();

export const createTicketController = new CreateTicketController(
  prismaEventRepository,
  prismaTicketRepository
);
