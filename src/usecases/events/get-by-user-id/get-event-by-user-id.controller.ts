import { Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { IGetEventByUserIdResponse } from "./get-event-by-user-id.dto";

interface IQuery {
  page: number;
  limit: number;
}

export class FindEventByUserIdController {
  constructor(private eventsRepository: IEventsRepository) {}

  async handle(request: RequestWithAuth, response: Response) {
    let { page = 1, limit = 20 } = request.query as unknown as IQuery;
    try {
      let [total, events] = await this.eventsRepository.findByUserId({
        user_id: request.user.uid,
        limit,
        page,
      });

      const eventResponse: IGetEventByUserIdResponse[] = [];

      for (const event of events) {
        const nowDate = new Date();
        if (event.end_date <= nowDate) {
          // evento encerrou
          event.status = "finished";
          await this.eventsRepository.update(event);
        }

        let remaining = 0;
        let sold = 0;

        for (const susbcription of event.subscriptions) {
          if (susbcription.status === "completed") {
            sold += 1;
          }
        }

        const filteredIickets = event.tickets.filter((ticket) => {
          const now = new Date();

          if (ticket.start_date >= now) {
            return false;
          }

          if (ticket.due_date <= now) {
            return false;
          }
          return true;
        });

        const ticketTotalParticipant =
          filteredIickets.length > 0
            ? filteredIickets.reduce((accumulator, ticket) => {
                return (accumulator += ticket.participant_limit);
              }, 0)
            : 0;

        remaining =
          ticketTotalParticipant > 0 ? ticketTotalParticipant - sold : 0;

        eventResponse.push({
          end_date: event.end_date,
          event_id: event.id,
          start_date: event.start_date,
          status: event.status,
          tickets: remaining,
          title: event.title,
        });
      }

      return sendSuccessful(response, {
        total,
        limit,
        page,
        events: eventResponse,
      });
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
