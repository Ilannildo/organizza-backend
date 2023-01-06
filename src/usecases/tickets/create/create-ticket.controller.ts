import { Request, Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { TicketModel } from "../../../models/ticket.model";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

export class CreateTicketController {
  constructor(
    private eventsRepository: IEventsRepository,
    private ticketRepository: ITicketRepository
  ) {}
  async handle(request: Request<{ event_id: string }>, response: Response) {
    try {
      const {
        category_title,
        start_date,
        start_time,
        description,
        due_date,
        due_time,
        event_id,
        include_fee,
        participant_limit,
        ticket_price_type_id,
        value,
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

      // TODO: implementar verificação para ticket_price_type_id

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
      const dueDate = new Date(due_date);

      if (dueDate <= startDate) {
        return sendError(
          response,
          Codes.VALIDATION_ERROR,
          "A data de término das vendas deve ser maior que a data de início das vendas",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const ticket = new TicketModel({
        category_title,
        start_date,
        start_time,
        description,
        due_date,
        due_time,
        event_id,
        include_fee,
        participant_limit,
        ticket_price_type_id,
        value,
        sold: 0,
      });
      //
      const ticketCreated = await this.ticketRepository.save(ticket);

      return sendSuccessful(response, ticketCreated, HttpStatus.CREATED);
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
