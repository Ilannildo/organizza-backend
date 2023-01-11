import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { RequestWithAuth } from "../../../utils/types";
import { EventResponsibleModel } from "../../../models/event-responsible.model";
import { convertToSlug } from "../../../utils/formatters/slug";
import { AddressModel } from "../../../models/address.model";
import { EventModel } from "../../../models/event.model";

export class CreateEventController {
  constructor(private eventsRepository: IEventsRepository) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      const {
        title,
        event_type_id,
        main_subject_id,
        short_description,
        venue_type,
        is_private,
        start_date,
        end_date,
        address,
        city_id,
        responsible_name,
        responsible_email,
        responsible_description,
      } = request.body;
      
      const eventAlreadyExistsByTitle = await this.eventsRepository.findByTitle(
        title
      );

      if (eventAlreadyExistsByTitle) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "Já existe um evento com esse título",
          HttpStatus.CONFLICT
        );
      }

      const newResponsible = new EventResponsibleModel({
        name: responsible_name,
        email: responsible_email,
        description: responsible_description,
      });

      const newEvent = new EventModel({
        title: title,
        created_by_user_id: request.user.uid,
        event_type_id: event_type_id,
        main_subject_id: main_subject_id,
        short_description: short_description,
        venue_type: venue_type,
        is_private: is_private,
        start_date: start_date,
        end_date: end_date,
        event_responsible_id: newResponsible.id,
        slug: convertToSlug(title),
        status: "started",
      });

      const created = await this.eventsRepository.save(
        newEvent,
        newResponsible
      );

      if (created.venue_type === "presential") {
        const newAddress = new AddressModel({
          city_id,
          street: address,
        });
        // criar endereço para o evento
      }
      return sendSuccessful(response, created, HttpStatus.CREATED);
    } catch (error) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
