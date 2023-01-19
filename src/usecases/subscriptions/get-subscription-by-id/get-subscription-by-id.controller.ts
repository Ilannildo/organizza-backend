import { Request, Response } from "express";
import { ISubscriptionRepository } from "../../../repositories/interfaces/susbcription-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { IGetSubscriptionByIdResponse } from "./get-subscription-by-id.dto";

export class GetSubscriptionByIdController {
  constructor(private subscriptionRepository: ISubscriptionRepository) {}

  async handle(
    request: Request<{ subscription_id: string }>,
    response: Response
  ) {
    try {
      const { subscription_id } = request.params;

      const subscription = await this.subscriptionRepository.findById(
        subscription_id
      );

      if (!subscription) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Inscrição não encontrada",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const serviceOrder = subscription.ticket_service_order.service_order;

      const transaction = serviceOrder.transactions.find(
        (transaction) =>
          transaction.status === "approved" ||
          transaction.status === "pending" ||
          transaction.status === "processing"
      );

      // calcular o preço final do ticket (incluindo a taxa)
      const fee = calculateTicketFee({
        ticket_price_type:
          subscription.ticket_service_order.ticket.ticket_price_type,
        value: subscription.ticket_service_order.ticket.value,
      });

      const ticketValue = calculateTicketValue({
        fee,
        includeFee: subscription.ticket_service_order.ticket.include_fee,
        value: subscription.ticket_service_order.ticket.value,
      });

      const subscriptionResponse: IGetSubscriptionByIdResponse = {
        code: subscription.code_ref,
        event: {
          end_date: subscription.event.end_date,
          start_date: subscription.event.start_date,
          title: subscription.event.title,
          slug: subscription.event.slug,
          place:
            subscription.event.venue_type === "online"
              ? "Evento online"
              : "Evento presencial",
        },
        id: subscription.id,
        participant: {
          email: subscription.user.email,
          name: subscription.user.name,
        },
        status: subscription.status,
        summary: {
          amount_total: serviceOrder.amount_total,
          code_ref: subscription.code_ref,
          fee: 0,
          payment_date: serviceOrder.paid_at,
          payment_method: transaction && transaction.payment_method.name,
          status_payment: serviceOrder.status,
          subscription_date: subscription.created_at,
          value: subscription.ticket_service_order.ticket.value,
        },
        ticket: {
          price: ticketValue,
          title: subscription.ticket_service_order.ticket.category_title,
          is_free:
            subscription.ticket_service_order.ticket.ticket_price_type.is_free,
        },
      };

      return sendSuccessful(response, subscriptionResponse);
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
