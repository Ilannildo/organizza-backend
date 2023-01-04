import axios from "axios";
import { calculateTicketFee } from "../../utils/roles";
import {
  IPaymentGatewayServiceCreateOrderRequest,
  IPaymentGatewayServiceCreateOrderResponse,
} from "../interfaces/payment-gateway.dto";
import { IPaymentGatewayService } from "../interfaces/payment-gateway.service";

const API_KEY =
  process.env.NODE_ENV === "production"
    ? process.env.PAGARME_API_KEY_PROD
    : process.env.PAGARME_API_KEY_TEST;

const pagarmeApi = axios.create({
  baseURL: process.env.PAGARME_API_URL,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: "Basic " + Buffer.from(`${API_KEY}:`).toString("base64"),
  },
});

export class PagarmeGateway implements IPaymentGatewayService {
  async createOrder({
    billing,
    customer,
    recipient,
    installments,
    service_order,
    transaction,
    credit_card,
    ticket,
    payment_method,
    admin_recipient,
  }: IPaymentGatewayServiceCreateOrderRequest) {
    try {
      const fee = calculateTicketFee({
        ticket_price_type: ticket.ticket_price_type,
        value: ticket.value,
      });

      const splitPlatformAmount = ticket.include_fee
        ? (service_order.amount_total - ticket.value) * 100
        : (service_order.amount_total + fee - ticket.value) * 100;

      const splitRecipientAmount = ticket.include_fee
        ? ticket.value * 100
        : (ticket.value - fee) * 100;

      const creditCardParams = {
        credit_card: {
          card: {
            number: credit_card.number,
            holder_name: credit_card.owner_name,
            exp_month: Number(credit_card.expiration_date.split("/")[0]),
            exp_year: Number(credit_card.expiration_date.split("/")[1]),
            cvv: credit_card.cvv,
            billing_address: {
              line_1: `${billing.number}, ${billing.address}, ${billing.neighborhood}`,
              zip_code: billing.zipcode,
              city: billing.city,
              state: billing.state,
              country: billing.country,
            },
          },
          installments,
          statement_descriptor: "ORGANIZZA EVT",
        },
        split: [
          {
            options: {
              charge_processing_fee: true,
              charge_remainder_fee: true,
              liable: true,
            },
            amount: splitPlatformAmount,
            recipient_id: admin_recipient.external_recipient_id, // organizza eventos
            type: "flat",
          },
          {
            options: {
              charge_processing_fee: false,
              charge_remainder_fee: false,
              liable: false,
            },
            amount: splitRecipientAmount,
            type: "flat",
            recipient_id: recipient.external_recipient_id, // recebedor
          },
        ],
        payment_method: "credit_card",
      };

      let paymentParams;

      if (payment_method.payment_form === "credit") {
        paymentParams = creditCardParams;
      }

      const transactionParams = {
        items: [
          {
            amount: service_order.amount_total * 100,
            description: ticket.category_title,
            quantity: 1,
            code: service_order.ticket_service_order.ticket_id,
          },
        ],
        customer: {
          phones: {
            mobile_phone: {
              country_code: "55",
              area_code: customer.phone.slice(0, 2),
              number: customer.phone,
            },
          },
          code: customer.email,
          name: customer.name,
          email: customer.email,
          type: "individual",
          document: customer.document,
        },
        payments: [paymentParams],
      };

      const response = await pagarmeApi.post("/orders", transactionParams);
      console.log("Teste pagar me", response.data);

      return response.data;
    } catch (error) {
      console.log("Error", error.response);
      console.log("Error", error.response.data);
      console.log("Error", error.response.data.errors);
    }
  }
}
