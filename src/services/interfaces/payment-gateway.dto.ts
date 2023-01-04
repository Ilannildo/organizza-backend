import { PaymentMethodModel } from "../../models/payment-method.model";
import { ServiceOrderModel } from "../../models/service-order.model";
import { TicketModel } from "../../models/ticket.model";
import { TransactionModel } from "../../models/transaction.model";

export interface IPaymentGatewayServiceCreateOrderRequest {
  transaction: TransactionModel;
  payment_method: PaymentMethodModel;
  service_order: ServiceOrderModel;
  ticket: TicketModel;
  installments: number;
  credit_card?: {
    number: string;
    cvv: string;
    owner_name: string;
    expiration_date: string;
  };
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
}

export interface IPaymentGatewayServiceCreateOrderResponse {}