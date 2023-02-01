import { Request, Response } from "express";
import { SessionDatesModel } from "../../../models/session-date.model";
import { SessionTicketModel } from "../../../models/session-ticket.model";
import { SessionModel } from "../../../models/session.model";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { ISessionTicketRepository } from "../../../repositories/interfaces/session-ticket-repository";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";
import { Codes } from "../../../utils/codes";
import { generateReferenceCode } from "../../../utils/formatters/generate-code-ref";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

export interface ISessionDatesForm {
  date: Date;
  type: "start" | "end";
  position: number;
}

export class CreateSessionController {
  constructor(
    private eventsRepository: IEventsRepository,
    private sessionRespository: ISessionRepository,
    private sessionTypeRepository: ISessionTypeRepository,
    private sessionTicketRepository: ISessionTicketRepository
  ) {}
  async handle(request: Request<{ event_id: string }>, response: Response) {
    try {
      const {
        title,
        credit_hour,
        summary,
        responsible_name,
        session_type_id,
        ticket_price_type_id,
        value,
        participant_limit,
        place,
        start_date,
        end_date,
        dates,
      } = request.body;

      const { event_id } = request.params;

      const eventAlreadyExistsById = await this.eventsRepository.findById(
        event_id
      );

      if (!eventAlreadyExistsById) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "O evento informado não foi encontrado",
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
          "O tipo da sessão informada não foi encontrado ou pode está desativada para esse evento",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const session = new SessionModel({
        title,
        credit_hour,
        summary,
        responsible_name,
        event_id: eventAlreadyExistsById.id,
        session_type_id: sessionType.id,
        place,
        code_ref: generateReferenceCode(sessionType.title),
        status: "started",
      });

      const newsSessionDates: SessionDatesModel[] = [];
      const sessionDates = dates as ISessionDatesForm[];

      for (const date of sessionDates) {
        const newDate = new SessionDatesModel({
          date: date.date,
          position: date.position,
          status: "started",
          type: date.type,
        });
        newsSessionDates.push(newDate);
      }

      const sessionCreated = await this.sessionRespository.save(
        session,
        newsSessionDates
      );

      const sessionTicket = new SessionTicketModel({
        participant_limit,
        session_id: sessionCreated.id,
        ticket_price_type_id,
        value,
      });

      await this.sessionTicketRepository.save(sessionTicket);

      return sendSuccessful(response, sessionCreated, HttpStatus.CREATED);
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
