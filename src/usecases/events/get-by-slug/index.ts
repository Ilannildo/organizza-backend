import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { FindEventController } from "./get-event.controller";

const prismaEventRepository = new PrismaEventRepository();
export const findEventController = new FindEventController(
  prismaEventRepository
);
