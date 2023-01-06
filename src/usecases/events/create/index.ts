import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { CreateEventController } from "./create-event.controller";

const prismaEventRepository = new PrismaEventRepository();
export const createEventController = new CreateEventController(
  prismaEventRepository
);
