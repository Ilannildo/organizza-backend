import { IEventsRepository } from "../../../repositories/interfaces/IEventsRepository";
import { IFindEventRequestDTO } from "./FindEventByIdDTO";

export class FindEventByIdUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute({ event_id }: IFindEventRequestDTO) {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) {
      throw new Error(
        "Não encontramos o evento"
      );
    }
    return event;
  }
}
