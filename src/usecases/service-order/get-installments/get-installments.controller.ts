import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { RequestWithAuth } from "../../../utils/types";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IPaymentMethodRepository } from "../../../repositories/interfaces/payment-method-repository";
import { IServiceOrderRepository } from "../../../repositories/interfaces/service-order-repository";
import { IGetInstallmentsResponse } from "./get-installments.dto";
import { IInstallmentRepository } from "../../../repositories/interfaces/installment-repository";
import { calculateTicketFee, calculateTicketValue } from "../../../utils/roles";
import { ITicketRepository } from "../../../repositories/interfaces/ticket-repository";

export class GetInstallmentsController {
  constructor(
    private paymentMethodRepository: IPaymentMethodRepository,
    private serviceOrderRepository: IServiceOrderRepository,
    private installmentRepository: IInstallmentRepository,
    private ticketRepository: ITicketRepository
  ) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      const { payment_method_id, service_order_id } = request.params;

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

      const expiresIn = new Date(serviceOrder.expires_in * 1000);
      const now = new Date();
      if (expiresIn < now) {
        await this.serviceOrderRepository.update({
          ...serviceOrder,
          status: "closed",
        });
        return sendError(
          response,
          Codes.EXPIRED_TIME,
          "O tempo que tinha para fazer a compra acabou",
          HttpStatus.NOT_FOUND
        );
      }

      // busca um ticket pelo id
      const ticket = await this.ticketRepository.findById(
        serviceOrder.ticket_service_order.ticket_id
      );

      // verifica se a data de venda já começou
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

      // se o ticket não existir, retorna um erro
      if (!ticket) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Esse ingresso não existe",
          HttpStatus.NOT_FOUND
        );
      }

      const paymentMethod = await this.paymentMethodRepository.findById(
        payment_method_id
      );

      if (!paymentMethod) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Esse tipo de pagamento não existe",
          HttpStatus.NOT_FOUND
        );
      }

      const installments =
        await this.installmentRepository.findByPaymentMethodId(
          paymentMethod.id
        );

      const installmentResponse: IGetInstallmentsResponse[] = [];

      installments.forEach((installment) => {
        let price = 0;

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

        price =
          installment.number === 1
            ? ticketValue
            : ticketValue + ticketValue * installment.fee;

        installmentResponse.push({
          total: Number(price.toFixed(2)),
          price: Number((price / installment.number).toFixed(2)),
          number: installment.number,
        });
      });

      return sendSuccessful(response, installmentResponse, HttpStatus.OK);
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
