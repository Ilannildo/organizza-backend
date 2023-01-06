import { PaymentMethodModel } from "../../models/payment-method.model";
import { ServiceOrderModel } from "../../models/service-order.model";
import { RecipientModel } from "../../models/recipient.model";
import { TicketModel } from "../../models/ticket.model";

export interface IPaymentGatewayServiceCreateOrderRequest {
  payment_method: PaymentMethodModel;
  service_order: ServiceOrderModel;
  recipient: RecipientModel;
  admin_recipient: RecipientModel;
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

export interface IPaymentGatewayServiceCreateOrderResponse {
  transaction_id: string;
  status: IPaymentGatewayServiceStatusResponse;
  processed_response: string;
  card?: {
    id: string;
    first_six_digits: string;
    last_four_digits: string;
    brand: string;
  };
  pix?: {
    code: string;
    qr_code_url: string;
    expiration_date: Date;
  };
}

export type IPaymentGatewayServiceStatusResponse =
  | "started"
  | "processing"
  | "pending"
  | "approved"
  | "refused"
  | "refunded"
  | "chargeback"
  | "error";
