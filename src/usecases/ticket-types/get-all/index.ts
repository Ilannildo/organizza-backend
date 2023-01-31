import { PrismaTicketPriceTypeRepository } from "../../../repositories/implementations/prisma-ticket-price-type.repository";
import { GetAllTicketTypesController } from "./get-all-ticket-types.controller";

const prismaTicketPriceTypeRepository = new PrismaTicketPriceTypeRepository();
export const getAllTicketTypesController = new GetAllTicketTypesController(
  prismaTicketPriceTypeRepository
);
