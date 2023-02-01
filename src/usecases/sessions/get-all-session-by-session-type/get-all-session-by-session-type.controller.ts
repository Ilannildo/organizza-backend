import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { IGetAllSessionBySessionTypeResponse } from "./get-all-session-by-session-type.dto";

interface IQuery {
  page: number;
  limit: number;
}

export class GetAllSessionBySessionTypeController {
  constructor(
    private eventsRepository: IEventsRepository,
    private sessionTypeRepository: ISessionTypeRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async handle(
    request: Request<{ event_id: string; session_type_id: string }>,
    response: Response
  ) {
    let { page = 1, limit = 20 } = request.query as unknown as IQuery;
    const { session_type_id, event_id } = request.params;

    try {
      const event = await this.eventsRepository.findById(event_id);

      if (!event) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Esse evento não existe",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const sessionType = await this.sessionTypeRepository.findById({
        session_type_id,
      });

      if (!sessionType) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa sessão não existe",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (!sessionType.is_active) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa sessão pode está desativada",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const [total, sessions] =
        await this.sessionRepository.findAllBySessionTypeIdPaginate({
          sessionTypeId: sessionType.id,
          eventId: event_id,
          limit,
          page,
        });

      const sessionResponse: IGetAllSessionBySessionTypeResponse[] = [];
      for (const session of sessions) {
        // calcular o preço final do ticket (incluindo a taxa)

        const sessionDates = session.session_dates;
        const sessionStartDate = sessionDates.filter(
          (date) => date.type === "start"
        );
        const sessionEndDate = sessionDates.filter(
          (date) => date.type === "end"
        );

        const nowDate = new Date();
        const startDate = sessionStartDate[0].date;
        const endDate = sessionEndDate[sessionDates.length - 1].date;

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

        const fee = calculateTicketFee({
          ticket_price_type: session.session_tickets.ticket_price_type,
          value: session.session_tickets.value,
        });

        const ticketValue = calculateTicketValue({
          fee,
          includeFee: false,
          value: session.session_tickets.value,
        });
        sessionResponse.push({
          end_date: endDate,
          id: session.id,
          is_free: session.session_tickets.ticket_price_type.is_free,
          start_date: startDate,
          title: session.title,
          value: ticketValue,
          code_ref: session.code_ref,
          status: session.status,
        });
      }

      return sendSuccessful(
        response,
        { total, limit, page, sessions: sessionResponse },
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
