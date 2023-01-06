import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaTicketRepository } from "../../../repositories/implementations/prisma-ticket.repository";
import { GetAllTicketByEventIdController } from "./get-all-ticket-by-event-id.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketRepository = new PrismaTicketRepository();

export const getAllTicketByEventIdController =
  new GetAllTicketByEventIdController(
    prismaEventRepository,
    prismaTicketRepository
  );
