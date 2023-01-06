import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { FindEventByIdController } from "./get-event-by-id.controller";

const prismaEventRepository = new PrismaEventRepository();
export const findEventByIdController = new FindEventByIdController(
  prismaEventRepository
);
