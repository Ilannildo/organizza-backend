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

export const creditCards = [
  { name: "Visa", length: "13,16", prefixes: "4", checkdigit: true },
  {
    name: "MasterCard",
    length: "16",
    prefixes: "51,52,53,54,55",
    checkdigit: true,
  },
  {
    name: "DinersClub",
    length: "14,16",
    prefixes: "36,38,54,55",
    checkdigit: true,
  },
  {
    name: "CarteBlanche",
    length: "14",
    prefixes: "300,301,302,303,304,305",
    checkdigit: true,
  },
  { name: "AmEx", length: "15", prefixes: "34,37", checkdigit: true },
  {
    name: "Discover",
    length: "16",
    prefixes: "6011,622,64,65",
    checkdigit: true,
  },
  { name: "JCB", length: "16", prefixes: "35", checkdigit: true },
  { name: "enRoute", length: "15", prefixes: "2014,2149", checkdigit: true },
  { name: "Solo", length: "16,18,19", prefixes: "6334,6767", checkdigit: true },
  {
    name: "Switch",
    length: "16,18,19",
    prefixes: "4903,4905,4911,4936,564182,633110,6333,6759",
    checkdigit: true,
  },
  {
    name: "Maestro",
    length: "12,13,14,15,16,18,19",
    prefixes: "5018,5020,5038,6304,6759,6761,6762,6763",
    checkdigit: true,
  },
  {
    name: "VisaElectron",
    length: "16",
    prefixes: "4026,417500,4508,4844,4913,4917",
    checkdigit: true,
  },
  {
    name: "LaserCard",
    length: "16,17,18,19",
    prefixes: "6304,6706,6771,6709",
    checkdigit: true,
  },
];
