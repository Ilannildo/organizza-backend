import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

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

      const nowDate = new Date();
      console.log("Data atual >>>", nowDate);
      console.log("Data término evento >>>", event.end_date);
      if (event.end_date <= nowDate) {
        // evento encerrou
        const eventComplete = await this.eventsRepository.update({
          ...event,
          status: "finished",
        });
        return sendSuccessful(response, eventComplete);
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
