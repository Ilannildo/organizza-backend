import { Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";

export class FindEventByUserIdController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: RequestWithAuth, response: Response) {
    try {
      let events = await this.eventsRepository.findByUserId(request.user.uid);

      for (const event of events) {
        const nowDate = new Date();
        if (event.end_date <= nowDate) {
          // evento encerrou
          await this.eventsRepository.update({
            ...event,
            status: "finished",
          });
        }
      }

      // buscar novamente, pois pode haver atualizações
      // TO-DO: pensar em um fluxo melhor
      events = await this.eventsRepository.findByUserId(request.user.uid);

      return sendSuccessful(response, events);
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
