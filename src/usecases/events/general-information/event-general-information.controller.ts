import { Request, Response } from "express";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

export class EventGeneralInformation {
  constructor(
    private eventsRepository: IEventsRepository,
    private ticketRepository: ITicketRepository
  ) {}
  async handle(request: Request<{ event_id: string }>, response: Response) {
    // retornar as informações gerais para exibir no painel
    // - ingressos vendidos
    // - ingressos com status cancelado
    // - ingressos restantes para serem vendidos
    const { event_id } = request.params;

    try {
      // buscar o evento pelo id. Serve para validação do evento
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

      

      return sendSuccessful(response, eventAlreadyExistsById, HttpStatus.OK);
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
