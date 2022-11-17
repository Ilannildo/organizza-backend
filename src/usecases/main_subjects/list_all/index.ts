import { MainSubjectsRepository } from "../../../repositories/implementations/MainSubjectsRepository";
import { ListAllMainSubjectController } from "./ListAllMainSubjectController";
import { ListAllMainSubjectsUseCase } from "./ListAllMainSubjectsUseCase";

const mainSubjectsRepository = new MainSubjectsRepository();
const listAllMainSubjectsUseCase = new ListAllMainSubjectsUseCase(
  mainSubjectsRepository
);
export const listAllMainSubjectController = new ListAllMainSubjectController(
  listAllMainSubjectsUseCase
);
