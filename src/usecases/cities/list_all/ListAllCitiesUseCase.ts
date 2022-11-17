import { ICitiesRepository } from "../../../repositories/interfaces/ICitiesRepository";

export class ListAllCitiesUseCase {
  constructor(private citiesRepository: ICitiesRepository) {}

  async execute() {
    const cities = await this.citiesRepository.findAll({
      relations: {
        state: true,
      },
      where: {
        is_available_event: true,
      },
    });

    if (!cities) {
      throw new Error(
        "Nenhuma cidade encontrada. Entre em contato com o suporte"
      );
    }
    return cities;
  }
}
