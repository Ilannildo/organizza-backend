import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { GetEventPageController } from "./get-event-page.controller";

const prismaEventRepository = new PrismaEventRepository();
export const getEventPageController = new GetEventPageController(
  prismaEventRepository
);
