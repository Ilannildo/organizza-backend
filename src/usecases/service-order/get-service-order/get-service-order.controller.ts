import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { RequestWithAuth } from "../../../utils/types";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { TicketServiceOrderModel } from "../../../models/ticket-service-order.model";
import { ServiceOrderModel } from "../../../models/service-order.model";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { addMinutes, getUnixTime } from "date-fns";
import { IGetServiceOrderResponse } from "./get-service-order.dto";

export class GetServiceOrderController {
  constructor(
    private ticketRepository: ITicketRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private eventsRepository: IEventsRepository,
    private serviceOrderRepository: IServiceOrderRepository,
    private ticketServiceOrderRepository: ITicketServiceOrderRepository
  ) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      // recebe o body da requisição
      const { service_order_id } = request.params;

      const serviceOrder = await this.serviceOrderRepository.findById({
        service_order_id,
      });

      if (!serviceOrder) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa ordem de serviço não existe",
          HttpStatus.NOT_FOUND
        );
      }

      // busca um ticket pelo id
      const ticket = await this.ticketRepository.findById(
        serviceOrder.ticket_service_order.ticket_id
      );

      // se o ticket não existir, retorna um erro
      if (!ticket) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Esse ingresso não existe",
          HttpStatus.NOT_FOUND
        );
      }

      // busca um evento pelo id
      const event = await this.eventsRepository.findById(ticket.event_id);

      // se o evento não existir, retorna um erro
      if (!event) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "O evento desse ingresso não existe",
          HttpStatus.NOT_FOUND
        );
      }

      // verifica se o evento já finalizou
      if (event.status === "finished") {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "O evento já finalizou",
          HttpStatus.CONFLICT
        );
      }

      // busca as inscrições pelo id do ingresso
      const subscriptions = await this.subscriptionRepository.findByTicketId(
        ticket.id
      );

      // filtra somente as completas
      const completedSubscriptions = subscriptions.filter(
        (subscription) => subscription.status === "completed"
      );

      // verifica se existem vagas para esse ingresso
      if (completedSubscriptions.length === ticket.participant_limit) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "Esse ingresso está esgotado",
          HttpStatus.CONFLICT
        );
      }

      // verifica se a data de venda já começou
      const now = new Date();
      if (
        ticket.start_date > now &&
        ticket.start_time.getTime() > now.getTime()
      ) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "As vendas para esse ingresso ainda não iniciaram",
          HttpStatus.CONFLICT
        );
      }

      // verifica se a data de venda já finalizou
      if (ticket.due_date < now && ticket.due_time.getTime() < now.getTime()) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "As vendas para esse ingresso ainda já encerraram",
          HttpStatus.CONFLICT
        );
      }

      // verifica as inscrições pelo id do usuário
      const userSubscriptions =
        await this.subscriptionRepository.findByUserAndEventId({
          userId: request.user.uid,
          eventId: ticket.event_id,
        });

      for (const sub of userSubscriptions) {
        if (sub.status === "completed") {
          return sendError(
            response,
            Codes.CONFLICTING_CONDITION,
            "Você já possui uma inscrição para esse evento",
            HttpStatus.CONFLICT
          );
        }
        if (sub.status === "pending") {
          return sendError(
            response,
            Codes.CONFLICTING_CONDITION,
            "Você já possui uma inscrição pendente de pagamento. Verifique seu",
            HttpStatus.CONFLICT
          );
        }
        if (sub.status === "processing") {
          return sendError(
            response,
            Codes.CONFLICTING_CONDITION,
            "Você já possui uma inscrição em progresso",
            HttpStatus.CONFLICT
          );
        }
      }

      // verificar se ele já tem alguma ordem de serviço em progresso ou paga
      const existsTicketServiceOrderSettler =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: request.user.uid,
          ticketId: ticket.id,
          status: "settled",
        });

      if (existsTicketServiceOrderSettler) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "Você já possui uma inscrição para esse evento",
          HttpStatus.CONFLICT
        );
      }

      // verificar se ele já tem alguma ordem de serviço em progresso ou paga
      const existsTicketServiceOrderPending =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: request.user.uid,
          ticketId: ticket.id,
          status: "processing",
        });

      if (existsTicketServiceOrderPending) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "Você já possui uma inscrição em progresso",
          HttpStatus.CONFLICT
        );
      }

      // TODO: verificar se existe uma ordem de serviço que ainda não expirou e retornar ela
      const existsTicketServiceOrder =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: request.user.uid,
          ticketId: ticket.id,
          status: "open",
        });

      if (!existsTicketServiceOrder) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa ordem de serviço para o ingresso não existe",
          HttpStatus.NOT_FOUND
        );
      }

      const expiresIn = new Date(
        existsTicketServiceOrder.service_order.expires_in * 1000
      );

      if (expiresIn > now) {
        // // calcular o preço final do ticket (incluindo a taxa)
        const fee = calculateTicketFee({
          ticket_price_type: ticket.ticket_price_type,
          value: ticket.value,
        });

        const ticketValue = calculateTicketValue({
          fee,
          includeFee: ticket.include_fee,
          value: ticket.value,
        });

        const serviceOrderResponse: IGetServiceOrderResponse = {
          expires_in: existsTicketServiceOrder.service_order.expires_in,
          fee: ticket.include_fee ? fee : 0,
          quantity: 1,
          service_order_id: serviceOrder.id,
          subtotal: ticket.value,
          ticket: {
            event_title: event.title,
            title: ticket.category_title,
          },
          total: ticketValue,
        };

        return sendSuccessful(
          response,
          serviceOrderResponse,
          HttpStatus.CREATED
        );
      } else {
        await this.serviceOrderRepository.update({
          ...existsTicketServiceOrder.service_order,
          status: "closed",
        });
        return sendError(
          response,
          Codes.EXPIRED_TIME,
          "O tempo que tinha para fazer a compra acabou",
          HttpStatus.NOT_FOUND
        );
      }
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
