import { Request, Response } from "express";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { ISessionRepository } from "../../../repositories/interfaces/session-repository";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";

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

      return sendSuccessful(
        response,
        { total, limit, page, sessions },
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
