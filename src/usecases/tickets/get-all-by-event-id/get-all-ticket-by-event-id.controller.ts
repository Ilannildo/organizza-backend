import { Request, Response } from "express";
import { ICitiesRepository } from "../../../repositories/interfaces/city-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";

interface IQuery {
  page: number;
  limit: number;
}

export class GetAllTicketByEventIdController {
  constructor(
    private eventRepository: IEventsRepository,
    private ticketRepository: ITicketRepository
  ) {}

  async handle(request: Request<{ event_id: string }>, response: Response) {
    let { page = 1, limit = 20 } = request.query as unknown as IQuery;
    const { event_id } = request.params;
    try {
      const eventAlreadyExistsById = await this.eventRepository.findById(
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

      const [total, tickets] =
        await this.ticketRepository.findByEventIdPaginate({
          eventId: eventAlreadyExistsById.id,
          limit,
          page,
        });

      return sendSuccessful(
        response,
        { tickets, total, page, limit },
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
