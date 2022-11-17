import { IEventTypesRepository } from "../../../repositories/interfaces/IEventTypesRepository";
import { IMainSubjectRepository } from "../../../repositories/interfaces/IMainSubjectRepository";

export class ListAllMainSubjectsUseCase {
  constructor(private mainSubjectRepository: IMainSubjectRepository) {}

  async execute() {
    const subjects = await this.mainSubjectRepository.findAll();

    if (!subjects) {
      throw new Error(
        "Nenhuma assunto principal encontrado. Entre em contato com o suporte"
      );
    }
    return subjects;
  }
}
