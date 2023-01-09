import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { RequestWithAuth } from "../../../utils/types";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { ITransactionRepository } from "../../../repositories/interfaces/transaction-repository";

export class CloseServiceOrderController {
  constructor(
    private ticketRepository: ITicketRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private eventsRepository: IEventsRepository,
    private serviceOrderRepository: IServiceOrderRepository,
    private ticketServiceOrderRepository: ITicketServiceOrderRepository,
    private transactionRepository: ITransactionRepository
  ) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      // recebe o body da requisição
      const { order_id } = request.params;

      const transaction = await this.transactionRepository.findById({
        transaction_id: order_id,
      });

      if (!transaction) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa ordem de serviço não existe",
          HttpStatus.NOT_FOUND
        );
      }

      const serviceOrder = await this.serviceOrderRepository.findById({
        service_order_id: transaction.service_order_id,
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

      // verifica as inscrições pelo id do usuário
      const userSubscription =
        await this.subscriptionRepository.findOneByTicketId(ticket.id, "processing");

      if (!userSubscription) {
        return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
      }

      // verificar se ele já tem alguma ordem de serviço em progresso ou paga
      const existsTicketServiceOrderSettler =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: request.user.uid,
          ticketId: ticket.id,
          status: "settled",
        });

      if (existsTicketServiceOrderSettler) {
        return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
      }

      // TODO: verificar se existe uma ordem de serviço que ainda não expirou e retornar ela
      const existsTicketServiceProcessing =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: request.user.uid,
          ticketId: ticket.id,
          status: "processing",
        });

      if (!existsTicketServiceProcessing) {
        return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
      }

      await this.transactionRepository.update({
        ...transaction,
        status: "refused",
      });
      await this.subscriptionRepository.update({
        ...userSubscription,
        status: "refused",
      });
      await this.serviceOrderRepository.update({
        ...existsTicketServiceProcessing.service_order,
        status: "closed",
      });
      return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
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
