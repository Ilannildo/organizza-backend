import { PrismaEventRepository } from "../../../repositories/implementations/prisma-event.repository";
import { PrismaSessionDateRepository } from "../../../repositories/implementations/prisma-session-date.repository";
import { PrismaSessionRepository } from "../../../repositories/implementations/prisma-session.respository";
import { GetAllEventPageSessionsController } from "./get-all-event-page-sessions.controller";

const prismaEventRepository = new PrismaEventRepository();
const prismaSessionRepository = new PrismaSessionRepository();
const prismaSessionDateRepository = new PrismaSessionDateRepository();

export const getAllEventPageSessionsController =
  new GetAllEventPageSessionsController(
    prismaEventRepository,
    prismaSessionRepository,
    prismaSessionDateRepository
  );
