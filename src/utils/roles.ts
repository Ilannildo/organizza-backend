import { TicketPriceTypeModel } from "../models/ticket-price-type.model";

export function validateCpf(cpf: string) {
  let Soma;
  let Resto;
  Soma = 0;

  if (cpf === "00000000000") {
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }

  if (Resto !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(cpf.substring(10, 11), 10)) {
    return false;
  }
  return true;
}

export const calculateTicketValue = ({
  includeFee,
  fee,
  value,
}: {
  value: number;
  fee: number;
  includeFee: boolean;
}) => {
  let ticketValue = value;

  if (includeFee) {
    ticketValue = value + fee;
  } else {
    ticketValue = value;
  }

  return ticketValue;
};

export const calculateTicketFee = ({
  ticket_price_type,
  value,
}: {
  ticket_price_type: TicketPriceTypeModel;
  value: number;
}) => {
  let fee = 0;

  if (!ticket_price_type.is_free && ticket_price_type.quote) {
    fee = ticket_price_type.quote.min_base_value;
    if (value >= ticket_price_type.quote.min_value) {
      fee = value * ticket_price_type.quote.percentage;
    }
  }
  return fee;
};
