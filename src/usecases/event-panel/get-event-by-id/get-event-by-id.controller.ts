import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { IGetEventByIdResponse } from "./get-event-by-id.dto";

export class GetEventByIdController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: Request<{ event_id: string }>, response: Response) {
    try {
      const { event_id } = request.params;
      let event = await this.eventsRepository.findById(event_id);

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      const nowDate = new Date();

      if (event.end_date <= nowDate) {
        // evento encerrou
        event = await this.eventsRepository.update({
          ...event,
          status: "finished",
        });
      }

      let place: string;
      if (event.venue_type === "presential") {
        place = event.event_has_address
          ? event.event_has_address.address?.street
          : "Nenhum endereço cadastrado";
      }
      if (event.venue_type === "online") {
        place = event.event_has_address
          ? event.event_has_address.address?.address_link
          : "Nenhum link cadastrado";
      }

      const eventPanelResponse: IGetEventByIdResponse = {
        category: event.event_type.title,
        main_subject: event.main_subject.title,
        place,
        status: event.status,
        type: event.venue_type,
        views: 0,
        is_private: event.is_private,
      };

      return sendSuccessful(response, eventPanelResponse);
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
