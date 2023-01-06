import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { IGetAllEventPageSessionsResponse } from "./get-all-event-page-sessions.dto";
import _ from "lodash";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export class GetAllEventPageSessionsController {
  constructor(
    private eventRepository: IEventsRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async handle(request: Request, response: Response) {
    const { event_id } = request.query;
    try {
      const eventAlreadyExistsById = await this.eventRepository.findById(
        event_id.toString()
      );
      if (!eventAlreadyExistsById) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "O evento informado não existe",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      const allSessions = await this.sessionRepository.findByEventId(
        eventAlreadyExistsById.id
      );

      const sessionsResponse: IGetAllEventPageSessionsResponse[] = [];

      for (let session of allSessions) {
        const now = new Date();
        if (
          session.end_date.getDate() <= now.getDate() &&
          session.end_time.getTime() <= now.getTime()
        ) {
          session = await this.sessionRepository.update({
            ...session,
            status: "finished",
          });
        }

        sessionsResponse.push({
          end_time: session.end_time,
          responsible_name: session.responsible_name,
          session_id: session.id,
          start_date: session.start_date,
          start_time: session.start_time,
          summary: session.summary,
          title: session.title,
          is_finished: session.status === "finished" ? true : false,
          place: session.place,
        });
      }
      const allSessionsByStartDate = _.groupBy(
        sessionsResponse,
        (session) => session.start_date
      );

      return sendSuccessful(
        response,
        allSessionsByStartDate,
        HttpStatus.OK
      );
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
