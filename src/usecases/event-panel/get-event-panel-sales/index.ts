import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaTicketServiceOrderRepository } from "../../../repositories/implementations/prisma-ticket-service-order.repository";
import { GetEventPanelSalesController } from "./get-event-panel-sales.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaTicketServiceOrderRepository =
  new PrismaTicketServiceOrderRepository();

export const getEventPanelSalesController = new GetEventPanelSalesController(
  prismaEventRepository,
  prismaTicketServiceOrderRepository
);
