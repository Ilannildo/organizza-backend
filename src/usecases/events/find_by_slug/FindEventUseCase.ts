import { IEventsRepository } from "../../../repositories/interfaces/IEventsRepository";
import { IFindEventRequestDTO } from "./FindEventDTO";

export class FindEventUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute({ slug }: IFindEventRequestDTO) {
    const event = await this.eventsRepository.findBySlug(slug);

    if (!event) {
      throw new Error(
        "Não encontramos o evento"
      );
    }
    return event;
  }
}
