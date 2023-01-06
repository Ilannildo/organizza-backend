import { Request, Response } from "express";
import { ICitiesRepository } from "../../../repositories/interfaces/city-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { IGetAllEventPageTicketsResponse } from "./get-all-event-page-tickets.dto";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { format } from "date-fns";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";

export class GetAllEventPageTicketController {
  constructor(
    private eventRepository: IEventsRepository,
    private ticketRepository: ITicketRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private ticketServiceOrderRepository: ITicketServiceOrderRepository,
    private userRespository: IUsersRepository
  ) {}

  async handle(request: Request, response: Response) {
    const { event_id } = request.query;
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

      const alltickets = await this.ticketRepository.findByEventId(
        eventAlreadyExistsById.id
      );

      const ticketsResponse: IGetAllEventPageTicketsResponse[] = [];
      for (const ticket of alltickets) {
        // buscar quantas inscrições para o ticket estão com status completo
        let status = "Comprar ingresso";
        let available = true;
        const subscriptions = await this.subscriptionRepository.findByTicketId(
          ticket.id
        );

        const completedSubscriptions = subscriptions.filter(
          (subscription) => subscription.status === "completed"
        );

        if (completedSubscriptions.length === ticket.participant_limit) {
          available = false;
          status = "Esgotado";
        }

        const existsTicketServiceOrder =
          await this.ticketServiceOrderRepository.findAllByTicketId({
            ticketId: ticket.id,
            status: "open",
          });

        if (existsTicketServiceOrder.length === ticket.participant_limit) {
          available = false;
          status = "Esgotado";
        }

        if (!ticket.ticket_price_type.is_free) {
          // verifica se o organizador pode receber pagamentos
          const userRecipient = await this.userRespository.findById(
            eventAlreadyExistsById.created_by_user_id
          );

          if (!userRecipient) {
            available = false;
            status = "Não inicicado";
          }

          if (!userRecipient.recipient) {
            available = false;
            status = "Não inicicado";
          }

          if (userRecipient.recipient.status !== "completed") {
            available = false;
            status = "Não inicicado";
          }
        }

        // calcular o preço final do ticket (incluindo a taxa)
        const fee = calculateTicketFee({
          ticket_price_type: ticket.ticket_price_type,
          value: ticket.value,
        });

        const ticketValue = calculateTicketValue({
          fee,
          includeFee: ticket.include_fee,
          value: ticket.value,
        });

        const now = new Date();
        if (
          ticket.start_date > now &&
          ticket.start_time.getTime() > now.getTime()
        ) {
          status = "Não iniciado";
          available = false;
        }

        if (
          ticket.due_date < now &&
          ticket.due_time.getTime() < now.getTime()
        ) {
          status = "Encerrado";
          available = false;
        }

        ticketsResponse.push({
          ticket_id: ticket.id,
          category_title: ticket.category_title,
          description: ticket.description,
          is_free: ticket.ticket_price_type.is_free,
          value: ticketValue,
          available,
          status,
          due_date: ticket.due_date,
          due_time: ticket.due_time,
        });
      }

      return sendSuccessful(response, ticketsResponse, HttpStatus.OK);
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
