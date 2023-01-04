import { PaymentMethodModel } from "../models/payment-method.model";
import { ServiceOrderModel } from "../models/service-order.model";
import { TicketServiceOrderModel } from "../models/ticket-service-order.model";
import { TicketModel } from "../models/ticket.model";
import { TransactionModel } from "../models/transaction.model";
import { ITransactionRepository } from "../repositories/interfaces/transaction-repository";
import { IPaymentGatewayService } from "../services/interfaces/payment-gateway.service";

interface ICreateTransactionRepository {
  service_order: ServiceOrderModel;
  payment_method: PaymentMethodModel;
  ticket: TicketModel;
  installments: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  billing: {
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    country: string;
    zipcode: string;
    state: string;
  };
  credit_card?: {
    number: string;
    cvv: string;
    owner_name: string;
    expiration_date: string;
  };
}

export class CreateTransactionProvider {
  constructor(
    private transactionRepository: ITransactionRepository,
    private paymentGatewayService: IPaymentGatewayService
  ) {}

  async execute({
    customer,
    payment_method,
    service_order,
    billing,
    installments,
    credit_card,
    ticket,
  }: ICreateTransactionRepository) {
    const newTransaction = new TransactionModel({
      customer_document: customer.document,
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone,
      operation: "order",
      payment_method_id: payment_method.id,
      service_order_id: service_order.id,
      status: "started",
      type: "input",
      billing_address: billing.address,
      billing_city: billing.city,
      billing_neighborhood: billing.neighborhood,
      billing_number: billing.number,
      billing_state: billing.state,
      billing_zipcode: billing.zipcode,
    });
    const transaction = await this.transactionRepository.save(newTransaction);

    const order = await this.paymentGatewayService.createOrder({
      customer,
      payment_method,
      service_order,
      billing,
      installments,
      transaction,
      credit_card,
      ticket,
    });

    return order;
  }
}
