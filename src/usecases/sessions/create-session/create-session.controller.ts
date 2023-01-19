import { Request, Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { SessionModel } from "../../../models/session.model";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";

export class CreateSessionController {
  constructor(
    private eventsRepository: IEventsRepository,
    private sessionRespository: ISessionRepository,
    private sessionTypeRepository: ISessionTypeRepository
  ) {}
  async handle(request: Request<{ event_id: string }>, response: Response) {
    try {
      const {
        title,
        credit_hour,
        summary,
        responsible_name,
        event_id,
        session_type_id,
        place,
        start_date,
        end_date,
      } = request.body;

      const eventAlreadyExistsById = await this.eventsRepository.findById(
        event_id
      );

      if (!eventAlreadyExistsById) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "O evento informado não existe",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const sessionType = await this.sessionTypeRepository.findById(
        session_type_id
      );

      if (!sessionType) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "O tipo da sessão informada não existe ou pode está desativada para esse evento",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      // verifica se a data de início de vendas é maior que a data atual
      const currentDate = new Date();
      const startDate = new Date(start_date);
      if (startDate < currentDate) {
        return sendError(
          response,
          Codes.VALIDATION_ERROR,
          "A data de início das vendas deve ser maior que a data atual",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      // verifica se a data de término de vendas é maior que a data de início de vendas
      const endDate = new Date(end_date);

      if (endDate <= startDate) {
        return sendError(
          response,
          Codes.VALIDATION_ERROR,
          "A data de término deve ser maior que a data de início da sessão",
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
        start_date,
        end_date,
        status: "started",
      });

      const sessionCreated = await this.sessionRespository.save(session);

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
