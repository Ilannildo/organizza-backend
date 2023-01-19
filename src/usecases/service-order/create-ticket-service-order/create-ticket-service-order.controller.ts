import { addMinutes, getUnixTime } from "date-fns";
import { Response } from "express";
import { ServiceOrderModel } from "../../../models/service-order.model";
import { TicketServiceOrderModel } from "../../../models/ticket-service-order.model";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { RequestWithAuth } from "../../../utils/types";

export class CreateTicketServiceOrderController {
  constructor(
    private ticketRepository: ITicketRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private eventsRepository: IEventsRepository,
    private serviceOrderRepository: IServiceOrderRepository,
    private ticketServiceOrderRepository: ITicketServiceOrderRepository,
    private userRespository: IUsersRepository
  ) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      // recebe o body da requisição
      const { ticket_id } = request.body;

      // busca um ticket pelo id
      const ticket = await this.ticketRepository.findById(ticket_id);

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
      // TODO: REMOVER ESSE COMENTÁRIO
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
      if (ticket.start_date >= now) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "As vendas para esse ingresso ainda não iniciaram",
          HttpStatus.CONFLICT
        );
      }

      // verifica se a data de venda já finalizou
      if (ticket.due_date <= now) {
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
            "Você já possui uma inscrição pendente de pagamento. Verifique seu email!",
            HttpStatus.CONFLICT
          );
        }
        if (sub.status === "processing") {
          return sendError(
            response,
            Codes.CONFLICTING_CONDITION,
            "Você já possui uma inscrição em progresso. Aguarde!",
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

      if (existsTicketServiceOrder) {
        const now = new Date();
        const expiresIn = new Date(
          existsTicketServiceOrder.service_order.expires_in * 1000
        );

        if (expiresIn > now) {
          return sendSuccessful(
            response,
            existsTicketServiceOrder,
            HttpStatus.CREATED
          );
        } else {
          await this.serviceOrderRepository.update({
            ...existsTicketServiceOrder.service_order,
            status: "closed",
          });
        }
      }

      if (!ticket.ticket_price_type.is_free) {
        // verifica se o organizador pode receber pagamentos
        const userRecipient = await this.userRespository.findById(
          event.created_by_user_id
        );

        if (!userRecipient) {
          return sendError(
            response,
            Codes.USER__NOT_FOUND,
            "Não conseguimos encontrar o organizador do evento. Tente novamente!",
            HttpStatus.NOT_FOUND
          );
        }

        if (!userRecipient.recipient) {
          return sendError(
            response,
            Codes.USER__NOT_FOUND,
            "Esse evento não pode receber inscrições pagas. Contate o organizador!",
            HttpStatus.NOT_FOUND
          );
        }

        if (userRecipient.recipient.status !== "completed") {
          return sendError(
            response,
            Codes.USER__NOT_FOUND,
            "Esse evento não pode receber inscrições pagas. Contate o organizador!",
            HttpStatus.NOT_FOUND
          );
        }
      }

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

      const expires_in = getUnixTime(addMinutes(new Date(), 30)); // add 10 minutes

      const newServiceOrder = new ServiceOrderModel({
        amount_total: ticketValue,
        status: "open",
        user_id: request.user.uid,
        type: "event",
        expires_in,
      });

      const serviceOrder = await this.serviceOrderRepository.save(
        newServiceOrder
      );

      const newTicketServiceOrder = new TicketServiceOrderModel({
        service_order_id: serviceOrder.id,
        ticket_id: ticket.id,
      });

      const ticketServiceOrder = await this.ticketServiceOrderRepository.save(
        newTicketServiceOrder
      );

      return sendSuccessful(response, ticketServiceOrder, HttpStatus.CREATED);
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
