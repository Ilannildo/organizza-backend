import { Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { IGetEventInformationByUserIdResponse } from "./get-events-by-user-id-informations.dto";

interface IQuery {
  page: number;
  limit: number;
}

export class GetEventByUserIdInformationsController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: RequestWithAuth, response: Response) {
    try {
      let [total, events] = await this.eventsRepository.findByUserId({
        user_id: request.user.uid,
        limit: 1000,
        page: 1,
      });

      let available = 0;
      let finished = 0;

      for (const event of events) {
        const nowDate = new Date();
        if (event.end_date <= nowDate) {
          event.status = "finished";
          await this.eventsRepository.update(event);
        }

        if (event.status === "finished") {
          finished += 1;
        }
        if (event.status === "published") {
          available += 1;
        }
      }

      const eventResponse: IGetEventInformationByUserIdResponse = {
        available,
        finished,
        total,
      };

      return sendSuccessful(response, eventResponse);
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
