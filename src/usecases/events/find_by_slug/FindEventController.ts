import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/IEventsRepository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

export class FindEventController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: Request, response: Response) {
    const { slug } = request.query;
    const slugString = String(slug);

    try {
      const event = await this.eventsRepository.findBySlug(slugString);

      if (!event) {
        throw new Error("Não encontramos o evento");
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
