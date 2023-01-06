import { PrismaMainSubjectRepository } from "../../../repositories/implementations/prisma-main-subject.repository";
import { GetAllMainSubjectController } from "./get-all-main-subject.controller";

const prismaMainSubjectRepository = new PrismaMainSubjectRepository();
export const getAllMainSubjectController = new GetAllMainSubjectController(
  prismaMainSubjectRepository
);
