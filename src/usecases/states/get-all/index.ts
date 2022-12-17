import { PrismaStateRepository } from "../../../repositories/implementations/prisma-state.repository";
import { GetAllStatesController } from "./get-all-states.controller";

const prismaStateRepository = new PrismaStateRepository();
export const getAllStatesController = new GetAllStatesController(
  prismaStateRepository
);
