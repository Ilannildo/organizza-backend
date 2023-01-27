import { Request, Response } from "express";
import { SessionTicketModel } from "../../../models/session-ticket.model";
import { SessionModel } from "../../../models/session.model";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { ISessionTicketRepository } from "../../../repositories/interfaces/session-ticket-repository";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

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

      // verifica se a data de início é maior que a data atual
      const currentDate = new Date();
      const startDate = new Date(start_date);
      if (startDate < currentDate) {
        return sendError(
          response,
          Codes.VALIDATION_ERROR,
          "A data de início da atividade deve ser maior que a data atual",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      // verifica se a data de término é maior que a data de início de vendas
      const endDate = new Date(end_date);

      if (endDate <= startDate) {
        return sendError(
          response,
          Codes.VALIDATION_ERROR,
          "A data de término deve ser maior que a data de início da atividade",
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
        start_date: startDate,
        end_date: endDate,
        status: "started",
      });

      const sessionCreated = await this.sessionRespository.save(session);

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
