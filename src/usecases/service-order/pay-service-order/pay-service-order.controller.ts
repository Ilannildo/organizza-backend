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
import { IPaymentMethodRepository } from "../../../repositories/interfaces/payment-method-repository";
import { CreateTransactionProvider } from "../../../providers/create-transaction.provider";
import { IUsersRepository } from "../../../repositories/interfaces/user-repository";
import { IPayServiceORderResponse } from "./pay-service-order.dto";
import { SubscriptionModel } from "../../../models/subscription.model";

export class PayServiceOrderController {
  constructor(
    private ticketRepository: ITicketRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private eventsRepository: IEventsRepository,
    private serviceOrderRepository: IServiceOrderRepository,
    private ticketServiceOrderRepository: ITicketServiceOrderRepository,
    private paymentMethodRepository: IPaymentMethodRepository,
    private createTransactionProvider: CreateTransactionProvider,
    private userRespository: IUsersRepository
  ) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      // recebe o body da requisição
      const { service_order_id } = request.params;
      const {
        payment_method_id,
        installments,
        customer_document,
        customer_phone_number,
        billing_city,
        billing_address,
        billing_number,
        billing_neighborhood,
        billing_state,
        billing_zipcode,
        credit_card_number,
        credit_card_owner_name,
        credit_card_expiration_date,
        credit_card_cvv,
      } = request.body;

      const { user } = request;

      const serviceOrder = await this.serviceOrderRepository.findById({
        service_order_id,
      });

      if (!serviceOrder) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Não conseguimos encontrar o seu pedido. Tente novamente!",
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
          "Esse ingresso não encontrado",
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
          "O ingresso pertence à um evento que não existe mais ou está desativado",
          HttpStatus.NOT_FOUND
        );
      }

      // verifica se o evento já finalizou
      // TODO: REMOVER ESSE COMENTÁRIO
      if (event.status === "finished") {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "O ingresso pertence à um evento que já encerrou",
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
          "As vendas para esse ingresso já encerraram",
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

      if (expiresIn < now) {
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

      const paymentMethod = await this.paymentMethodRepository.findById(
        payment_method_id
      );

      if (!paymentMethod) {
        return sendError(
          response,
          Codes.EXPIRED_TIME,
          "O tipo de pagamento não é válido",
          HttpStatus.NOT_FOUND
        );
      }

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

      const transaction = await this.createTransactionProvider.execute({
        billing: {
          address: billing_address,
          city: billing_city,
          country: "BR",
          neighborhood: billing_neighborhood,
          number: billing_number,
          state: billing_state,
          zipcode: billing_zipcode,
        },
        customer: {
          document: customer_document,
          email: user.email,
          name: user.name,
          phone: customer_phone_number,
        },
        installments,
        payment_method: paymentMethod,
        service_order: serviceOrder,
        credit_card: {
          cvv: credit_card_cvv,
          expiration_date: credit_card_expiration_date,
          number: credit_card_number,
          owner_name: credit_card_owner_name,
        },
        ticket,
        recipient: userRecipient.recipient,
      });

      if (!transaction) {
        return sendError(
          response,
          Codes.EXPIRED_TIME,
          "Ocorreu um erro ao efetuar o pagamento. Tente novamente!",
          HttpStatus.NOT_FOUND
        );
      }

      const subscription = new SubscriptionModel({
        code_ref: "TESTE-123",
        event_id: event.id,
        status: "pending",
        ticket_service_order_id: existsTicketServiceOrder.id,
        user_id: user.uid,
      });

      if (transaction.order.status === "approved") {
        serviceOrder.status = "settled";
        subscription.status = "completed";
      }
      if (transaction.order.status === "error") {
        serviceOrder.status = "closed";
        subscription.status = "refused";
      }
      if (
        transaction.order.status === "chargeback" ||
        transaction.order.status === "refused" ||
        transaction.order.status === "refunded"
      ) {
        serviceOrder.status = "canceled";
        subscription.status = "refused";
      }
      if (
        transaction.order.status === "processing" ||
        transaction.order.status === "pending"
      ) {
        serviceOrder.status = "processing";
        subscription.status = "processing";
      }

      await this.serviceOrderRepository.update(serviceOrder);
      await this.subscriptionRepository.save(subscription);

      if (
        paymentMethod.payment_form === "pix" &&
        transaction.order.status === "pending"
      ) {
        const paymentPixResponse: IPayServiceORderResponse = {
          payment_method: "pix",
          order_id: transaction.order.transaction_id,
          status: transaction.order.status,
          expires_at: transaction.order.pix.expiration_date,
          qr_code: transaction.order.pix.code,
          qr_code_url: transaction.order.pix.qr_code_url,
        };
        return sendSuccessful(response, paymentPixResponse, HttpStatus.CREATED);
      }

      const paymentPixResponse: IPayServiceORderResponse = {
        payment_method: paymentMethod.payment_form,
        status: transaction.order.status,
        order_id: transaction.order.transaction_id,
      };

      return sendSuccessful(response, paymentPixResponse, HttpStatus.CREATED);
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
