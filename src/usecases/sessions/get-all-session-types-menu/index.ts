import { PrismaSessionTypeRespository } from "../../../repositories/implementations/prisma-session-type.repository";
import { GetAllSessionTypesMenuController } from "./get-all-session-types-menu.controller";

const prismaSessionTypeRespository = new PrismaSessionTypeRespository();
export const getAllSessionTypesMenuController =
  new GetAllSessionTypesMenuController(prismaSessionTypeRespository);
