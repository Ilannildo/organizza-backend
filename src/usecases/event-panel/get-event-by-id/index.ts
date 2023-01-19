import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { GetEventByIdController } from "./get-event-by-id.controller";

const prismaEventRepository = new PrismaEventRepository();
export const getEventByIdController = new GetEventByIdController(
  prismaEventRepository
);
