import { IStatesRepository } from "../../../repositories/interfaces/IStatesRepository";

export class ListAllStatesUseCase {
  constructor(private statesRepository: IStatesRepository) {}

  async execute() {
    const states = await this.statesRepository.findAll({
      relations: {
        cities: false,
      },
    });

    if (!states) {
      throw new Error(
        "Nenhum estado encontrado. Entre em contato com o suporte"
      );
    }
    return states;
  }
}
