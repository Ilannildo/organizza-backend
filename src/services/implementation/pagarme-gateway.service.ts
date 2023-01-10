import axios from "axios";
import { addMinutes, getUnixTime } from "date-fns";
import { calculateTicketFee } from "../../utils/roles";
import {
  IPaymentGatewayServiceCreateOrderRequest,
  IPaymentGatewayServiceCreateOrderResponse,
  IPaymentGatewayServiceStatusResponse,
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
    credit_card,
    ticket,
    payment_method,
    admin_recipient,
  }: IPaymentGatewayServiceCreateOrderRequest): Promise<IPaymentGatewayServiceCreateOrderResponse> {
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

      let paymentParams;

      if (payment_method.payment_form === "credit") {
        paymentParams = {
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
      }

      if (payment_method.payment_form === "pix") {
        paymentParams = {
          payment_method: "pix",
          pix: {
            expires_at: addMinutes(new Date(), 10),
            additional_information: [
              {
                name: "Quantidade",
                value: 1,
              },
              {
                name: "Descrição",
                value: ticket.category_title,
              },
            ],
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
        };
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
      

      const charge =
        response.data.charges.length > 0 ? response.data.charges[0] : null;

      if (!charge) {
        throw new Error("Algo alconteceu na transação");
      }

      console.log("PAGARME :::", charge);

      return {
        processed_response: JSON.stringify(response.data),
        transaction_id: charge.id,
        status: this.translateTransactionStatus(charge.status),
        card:
          payment_method.payment_form === "credit"
            ? {
                brand: charge.last_transaction.card.brand,
                first_six_digits: charge.last_transaction.card.first_six_digits,
                id: charge.last_transaction.card.id,
                last_four_digits: charge.last_transaction.card.last_four_digits,
              }
            : null,
        pix:
          payment_method.payment_form === "pix"
            ? {
                code: charge.last_transaction.qr_code,
                qr_code_url: charge.last_transaction.qr_code_url,
                expiration_date: charge.last_transaction.expires_at
              }
            : null,
      };
    } catch (error) {
      console.log("Error gateway", error);
      if (error.response) {
        console.log("Error", error.response.data);
        console.log("Error", error.response.data.errors);
      }
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
