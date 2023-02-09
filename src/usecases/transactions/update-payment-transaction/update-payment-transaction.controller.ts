import { Response } from "express";
import { SubscriptionModel } from "../../../models/subscription.model";
import { IEventsRepository } from "../../../repositories/interfaces/event-repository";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";
import { ITicketServiceOrderRepository } from "../../../repositories/interfaces/ticket-service-order-repository";
import { ITransactionRepository } from "../../../repositories/interfaces/transaction-repository";
import { IPaymentGatewayServiceStatusResponse } from "../../../services/interfaces/payment-gateway.dto";
import { Codes } from "../../../utils/codes";
import { generateReferenceCode } from "../../../utils/formatters/generate-code-ref";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";

export class UpdatePaymentTransactionController {
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
      const body = request.body;
      const data = body.data;
      const charge = data.charges.length > 0 ? data.charges[0] : null;

      if (!charge) {
        return sendError(
          response,
          Codes.UNKNOWN_ERROR,
          "Parâmetros obrigatórios ausentes",
          HttpStatus.FORBIDDEN
        );
      }

      const result = {
        processed_response: JSON.stringify(body),
        transaction_id: charge.id,
        status: this.translateTransactionStatus(charge.status),
      };

      const transaction =
        await this.transactionRepository.findByExternalTransactionId({
          transaction_id: result.transaction_id,
        });

      if (!transaction) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Transação não encontrada",
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
          "Ordem de serviço não encontrada",
          HttpStatus.NOT_FOUND
        );
      }

      const ticket = await this.ticketRepository.findById(
        serviceOrder.ticket_service_order.ticket_id
      );

      if (!ticket) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Ingresso não encontrado",
          HttpStatus.NOT_FOUND
        );
      }

      const event = await this.eventsRepository.findById(ticket.event_id);

      if (!event) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Evento não encontrado",
          HttpStatus.NOT_FOUND
        );
      }

      const existsTicketServiceOrderSettler =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: transaction.service_order.user_id,
          ticketId: ticket.id,
          status: "settled",
        });

      if (existsTicketServiceOrderSettler) {
        return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
      }

      // busca as inscrições pelo id do ingresso
      const subscriptions = await this.subscriptionRepository.findByTicketId(
        transaction.service_order.ticket_service_order.ticket.id
      );

      const existsTicketServiceOrderPending =
        await this.ticketServiceOrderRepository.findByUserIdTicketId({
          userId: transaction.service_order.user_id,
          ticketId: ticket.id,
          status: "processing",
        });

      const existsSubscription = subscriptions.find(
        (sub) =>
          sub.ticket_service_order_id === existsTicketServiceOrderPending.id
      );

      let subscription = new SubscriptionModel({
        code_ref: generateReferenceCode(
          transaction.service_order.ticket_service_order.ticket.category_title
        ),
        event_id:
          transaction.service_order.ticket_service_order.ticket.event_id,
        status: "pending",
        ticket_service_order_id: existsTicketServiceOrderPending.id,
        user_id: transaction.service_order.user_id,
      });

      if (existsSubscription) {
        subscription = existsSubscription;
      }

      if (result.status === "approved") {
        serviceOrder.status = "settled";
        serviceOrder.paid_at = new Date();
        subscription.status = "completed";
      }
      if (
        result.status === "chargeback" ||
        result.status === "refused" ||
        result.status === "refunded"
      ) {
        serviceOrder.status = "canceled";
        subscription.status = "refused";
      }
      if (result.status === "processing" || result.status === "pending") {
        serviceOrder.status = "processing";
        subscription.status = "processing";
      }
      if (result.status === "error") {
        serviceOrder.status = "closed";
        subscription.status = "refused";
      }

      await this.transactionRepository.update({
        ...transaction,
        processed_response: result.processed_response,
        status: result.status,
      });
      await this.serviceOrderRepository.update(serviceOrder);
      await this.subscriptionRepository.update(subscription);

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

  translateTransactionStatus(
    status:
      | "paid"
      | "canceled"
      | "processing"
      | "pending"
      | "failed"
      | "overpaid"
      | "underpaid"
      | "chargedback"
  ): IPaymentGatewayServiceStatusResponse {
    if (status === "paid") {
      return "approved";
    }
    const statusMap = {
      paid: "approved",
      canceled: "refused",
      pending: "pending",
      processing: "processing",
      failed: "error",
      overpaid: "refunded",
      underpaid: "refunded",
      chargedback: "chargeback",
    };

    return statusMap[status] as IPaymentGatewayServiceStatusResponse;
  }
}
