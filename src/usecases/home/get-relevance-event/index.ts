import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { GetRelevanceEventsController } from "./get-relevance-event.controller";

const prismaEventRepository = new PrismaEventRepository();

export const getRelevanceEventsController = new GetRelevanceEventsController(
  prismaEventRepository
);
