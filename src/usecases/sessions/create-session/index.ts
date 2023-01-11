import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaSessionTypeRespository } from "../../../repositories/implementations/prisma-session-type.repository";
import { PrismaSessionRepository } from "../../../repositories/implementations/prisma-session.respository";
import { CreateSessionController } from "./create-session.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaSessionRepository = new PrismaSessionRepository();
const prismaSessionTypeRespository = new PrismaSessionTypeRespository();

export const createSessionController = new CreateSessionController(
  prismaEventRepository,
  prismaSessionRepository,
  prismaSessionTypeRespository
);
