import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { FindEventByUserIdController } from "./get-event-by-user-id.controller";

const prismaEventRepository = new PrismaEventRepository();
export const findEventByUserIdController = new FindEventByUserIdController(
  prismaEventRepository
);
