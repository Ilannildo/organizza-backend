import { format } from "date-fns";
import { Request, Response } from "express";
import _ from "lodash";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ISessionDateRepository } from "../../../repositories/interfaces/session-date-repository";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { removeDuplicateDates } from "../../../utils/roles";

interface IQuery {
  event_id: string;
}

export class GetAllEventPageSessionsController {
  constructor(
    private eventRepository: IEventsRepository,
    private sessionRepository: ISessionRepository,
    private sessionDateRepository: ISessionDateRepository
  ) {}

  async handle(request: Request, response: Response) {
    const { event_id } = request.query as unknown as IQuery;
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

      // verifica se a sessão já encerrou
      for (let session of allSessions) {
        const sessionDates = session.session_dates;
        const sessionStartDate = sessionDates.filter(
          (date) => date.type === "start" && date.position
        );
        const sessionEndDate = sessionDates.filter(
          (date) => date.type === "end" && date.position
        );

        const nowDate = new Date();
        const startDate = sessionStartDate[0].date;
        const endDate = sessionEndDate[sessionEndDate.length - 1].date;

        if (startDate >= nowDate) {
          // sessão começou
          session.status = "published";
          await this.sessionRepository.update(session);
        }

        if (endDate <= nowDate) {
          // sessão encerrou
          session.status = "finished";
          await this.sessionRepository.update(session);
        }
      }

      // busca todas as datas e sessões para o evento
      const sessionDates = await this.sessionDateRepository.findByEventId({
        event_id,
      });

      // busca todos os dias em que terá uma sessão
      const sessionDaysRemovedDuplicated = removeDuplicateDates(
        sessionDates.filter((date) => date.type === "start")
      );

      // filtra e organiza as datas de uma sessão para os dias em que terão uma sessão
      const getAllEventPageSessionsResponse = sessionDates
        .filter(
          (date) =>
            sessionDaysRemovedDuplicated.find(
              (sessionDate) => date.date.getDate() === sessionDate.getDate()
            ) && date.type === "start"
        )
        .map((startDate) => {
          const endDate = sessionDates.find(
            (date) =>
              date.position === startDate.position &&
              date.session_id === startDate.session_id &&
              date.type === "end"
          ).date;

          return {
            start_date: startDate.date,
            end_date: endDate,
            is_finished: startDate.session.status === "finished",
            place: startDate.session.place,
            responsible_name: startDate.session.responsible_name,
            session_id: startDate.session.id,
            summary: startDate.session.summary,
            title: startDate.session.title,
          };
        });

      // agrupa pela data de término
      const allSessionsByEndDate = _.groupBy(
        getAllEventPageSessionsResponse,
        (session) => format(session.end_date, "yyyy-MM-dd")
      );
      // transforma em array
      const sessionResponse = _.toArray(allSessionsByEndDate);

      return sendSuccessful(
        response,
        {
          days: sessionDaysRemovedDuplicated,
          sessions: sessionResponse,
        },
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
