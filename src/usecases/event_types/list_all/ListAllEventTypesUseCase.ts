import { IEventTypesRepository } from "../../../repositories/interfaces/IEventTypesRepository";

export class ListAllEventTypesUseCase {
  constructor(private eventTypesRepository: IEventTypesRepository) {}

  async execute() {
    const types = await this.eventTypesRepository.findAll();

    if (!types) {
      throw new Error(
        "Nenhuma tipo de evento encontrado. Entre em contato com o suporte"
      );
    }
    return types;
  }
}
