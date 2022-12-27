import { PrismaSessionTypeRespository } from "../../../repositories/implementations/prisma-session-type.repository";
import { GetSessionTypeByIdController } from "./get-session-type-by-id.controller";

const prismaSessionTypeRespository = new PrismaSessionTypeRespository();
export const getSessionTypeByIdController = new GetSessionTypeByIdController(
  prismaSessionTypeRespository
);
