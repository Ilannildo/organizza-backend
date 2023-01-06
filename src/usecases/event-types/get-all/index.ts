import { PrismaEventTypeRepository } from "../../../repositories/implementations/prisma-event-type.repository";
import { GetAllEventTypesController } from "./get-all-event-types.controller";

const prismaEventTypeRepository = new PrismaEventTypeRepository();
export const getAllEventTypesController = new GetAllEventTypesController(
  prismaEventTypeRepository
);
