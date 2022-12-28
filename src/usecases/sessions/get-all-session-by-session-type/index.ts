import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaSessionTypeRespository } from "../../../repositories/implementations/prisma-session-type.repository";
import { PrismaSessionRepository } from "../../../repositories/implementations/prisma-session.respository";
import { GetAllSessionBySessionTypeController } from "./get-all-session-by-session-type.controller";

const prismaSessionTypeRespository = new PrismaSessionTypeRespository();
const prismaEventRepository = new PrismaEventRepository();
const prismaSessionRepository = new PrismaSessionRepository();
export const getAllSessionBySessionTypeController =
  new GetAllSessionBySessionTypeController(
    prismaEventRepository,
    prismaSessionTypeRespository,
    prismaSessionRepository
  );
