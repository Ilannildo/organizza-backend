import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/IEventsRepository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

export class FindEventByIdController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const { event_id } = request.query;
      const event_id_string = event_id.toString();
      const event = await this.eventsRepository.findById(event_id_string);

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      return sendSuccessful(response, event);
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
