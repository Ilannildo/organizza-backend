import { AddressModel } from "../../../models/address.model";
import { EventModel } from "../../../models/event.model";
import { EventResponsibleModel } from "../../../models/event_responsible.model";
import { IEventsRepository } from "../../../repositories/interfaces/IEventsRepository";
import { Codes } from "../../../utils/codes";
import { sendError } from "../../../utils/formatters/responses";
import { convertToSlug } from "../../../utils/formatters/slug";
import { HttpStatus } from "../../../utils/httpStatus";
import { ICreateEventRequestDTO } from "./CreateEventDTO";

export class CreateEventUseCase {
  constructor(private eventsRepository: IEventsRepository) {}

  async execute({ event }: ICreateEventRequestDTO) {
    const eventAlreadyExistsByTitle = await this.eventsRepository.findByTitle(
      event.title
    );

    if (eventAlreadyExistsByTitle) {
      // já existe um evento com esse título
      throw new Error(Codes.CONFLICTING_CONDITION);
    }

    // verificar se o responsável já existe e criar ou vincular
    const newResponsible = new EventResponsibleModel({
      name: event.responsible_name,
      email: event.responsible_email,
      description: event.responsible_description
    });

    const newEvent = new EventModel({
      title: event.title,
      created_by_user_id: event.created_by_user_id,
      event_type_id: event.event_type_id,
      main_subject_id: event.main_subject_id,
      short_description: event.short_description,
      venue_type: event.venue_type,
      is_private: event.is_private,
      start_date: event.start_date,
      start_time: event.start_time,
      end_date: event.end_date,
      end_time: event.end_time,
      event_responsible_id: newResponsible.id,
      slug: convertToSlug(event.title),
      status: "started",
    });

    const created = await this.eventsRepository.save(newEvent, newResponsible);

    if (created.venue_type === "presential") {
      const newAddress = new AddressModel({
        city_id: event.city_id,
        street: event.address,
      });
      // criar endereço para o evento
    }
    return created;
  }
}
