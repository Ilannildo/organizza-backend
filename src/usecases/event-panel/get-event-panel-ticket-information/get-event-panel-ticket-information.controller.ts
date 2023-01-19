import { Request, Response } from "express";
import { TicketModel } from "../../../models/ticket.model";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { IGetEventPanelTicketInformationResponse } from "./get-event-panel-ticket-information.dto";

export class GetEventPanelTicketInformationController {
  constructor(
    private eventsRepository: IEventsRepository,
    private ticketRepository: ITicketRepository,
    private subscriptionRepository: ISubscriptionRepository
  ) {}

  async handle(request: Request<{ event_id: string }>, response: Response) {
    try {
      const { event_id } = request.params;
      let event = await this.eventsRepository.findById(event_id);

      if (!event) {
        throw new Error("Evento não encontrado");
      }

      const tickets = await this.ticketRepository.findByEventId(event.id);

      const susbcriptions = await this.subscriptionRepository.findByEventId(
        event.id
      );

      let canceled = 0;
      let remaining = 0;
      let sold = 0;

      for (const susbcription of susbcriptions) {
        if (susbcription.status === "completed") {
          sold += 1;
        }
        if (susbcription.status === "refused") {
          canceled += 1;
        }
      }

      const filteredIickets = tickets.filter((ticket) => {
        const now = new Date();

        if (ticket.start_date >= now) {
          return false;
        }

        // verifica se a data de venda já finalizou
        if (ticket.due_date <= now) {
          return false;
        }
        return true;
      });

      const ticketTotalParticipant = filteredIickets.reduce(
        (accumulator, ticket) => {
          return (accumulator += ticket.participant_limit);
        },
        0
      );

      remaining = ticketTotalParticipant - sold;

      const eventPanelResponse: IGetEventPanelTicketInformationResponse = {
        canceled,
        remaining,
        sold,
      };

      return sendSuccessful(response, eventPanelResponse);
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
