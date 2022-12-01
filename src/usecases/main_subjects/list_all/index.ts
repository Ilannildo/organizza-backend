import { MainSubjectsRepository } from "../../../repositories/implementations/MainSubjectsRepository";
import { ListAllMainSubjectController } from "./ListAllMainSubjectController";

const mainSubjectsRepository = new MainSubjectsRepository();
export const listAllMainSubjectController = new ListAllMainSubjectController(
  mainSubjectsRepository
);
