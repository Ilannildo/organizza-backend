import { body, CustomValidator, param } from "express-validator";
import { Codes } from "../utils/codes";
import { HttpStatus } from "../utils/httpStatus";
import { validateCpf } from "../utils/roles";
import validationMiddleware from "../utils/middlewares/validations";
import { parsePhoneNumber } from "libphonenumber-js";
import { client } from "../prisma/client";

// This allows you to reuse the validator
const isValidCpf: CustomValidator = (value) => {
  const result = validateCpf(value);
  if (!result) {
    throw new Error("O CPF é inválido");
  }
  return true;
};

const isValidPhoneNumber: CustomValidator = (value) =>
  parsePhoneNumber(value, "BR").isValid();

// This allows you to reuse the validator
const isValidPaymentType: CustomValidator = async (value) => {
  const paymentMethods = await client.paymentMethod.findMany({
    where: {
      status: true,
    },
  });

  const result = paymentMethods.find(
    (payment) => payment.payment_form === value
  );

  if (!result) {
    throw new Error("O tipo de pagamento não é válido");
  }

  return true;
};

const isValidPaymentMethod: CustomValidator = async (value) => {
  const paymentMethods = await client.paymentMethod.findFirst({
    where: {
      status: true,
      id: value,
    },
  });

  if (!paymentMethods) {
    throw new Error("O tipo de pagamento não é válido");
  }

  return true;
};

export const pay = [
  param("service_order_id")
    .not()
    .isEmpty()
    .withMessage({
      message: "Alguns dados são obrigatórios",
      code: Codes.REQUEST__MISSING_PARAMS,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isUUID()
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.REQUEST__INVALID_NAME,
      message: "Esse método de pagamento não é válido",
    }),
  body("payment_method_id")
    .not()
    .isEmpty()
    .withMessage({
      message: "O método de pagamento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isUUID()
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.REQUEST__INVALID_NAME,
      message: "Esse método de pagamento não é válido",
    })
    .custom(isValidPaymentMethod)
    .withMessage({
      message: "O tipo de pagamento não é aceito",
      code: Codes.AUTH__INVALID_DOCUMENT,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("payment_type")
    .not()
    .isEmpty()
    .withMessage({
      message: "O método de pagamento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .custom(isValidPaymentType)
    .withMessage({
      message: "O tipo de pagamento não é aceito",
      code: Codes.AUTH__INVALID_DOCUMENT,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("installments")
    .not()
    .isEmpty()
    .withMessage({
      message: "A parcela é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isNumeric()
    .withMessage({
      message: "A parcela está em um formato inválido",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("customer_document")
    .not()
    .isEmpty()
    .withMessage({
      message: "O documento do participante é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .custom(isValidCpf)
    .withMessage({
      message: "Informe um CPF válido",
      code: Codes.AUTH__INVALID_CPF,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("customer_phone_number")
    .not()
    .isEmpty()
    .withMessage({
      message: "O número de telefone é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .custom(isValidPhoneNumber)
    .withMessage({
      message: "O número de telefone é inválido",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_number")
    .if(body("payment_type").equals("credit"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O número do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_expiration_date")
    .if(body("payment_type").equals("credit"))
    .not()
    .isEmpty()
    .withMessage({
      message: "A data de expiração do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_cvv")
    .if(body("payment_type").equals("credit"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O CVV do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_owner_name")
    .if(body("payment_type").equals("credit"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O nome do titular do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  validationMiddleware,
];
