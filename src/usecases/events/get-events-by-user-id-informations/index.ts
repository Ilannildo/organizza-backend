import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { GetEventByUserIdInformationsController } from "./get-events-by-user-id-informations.controller";

const prismaEventRepository = new PrismaEventRepository();

export const getEventByUserIdInformationsController =
  new GetEventByUserIdInformationsController(prismaEventRepository);
