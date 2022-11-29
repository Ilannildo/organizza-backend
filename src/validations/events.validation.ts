import { body, check, param } from "express-validator";
import { Codes } from "../utils/codes";
import { HttpStatus } from "../utils/httpStatus";
import validationMiddleware from "../utils/middlewares/validations";

export const upload_cover = [
  check("cover")
    .custom((value, { req }) => {
      if (!req.file) return false;
      return true;
    })
    .withMessage({
      message: "Você não informou nenhuma imagem",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  check("event_id")
    .not()
    .isEmpty()
    .withMessage({
      message: "Você não informou o evento",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isUUID()
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.REQUEST__INVALID_NAME,
      message: "Esse evento não é válido",
    }),
  validationMiddleware,
];

export const register = [
  check("title").not().isEmpty().withMessage({
    message: "O título do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  check("event_type_id")
    .not()
    .isEmpty()
    .withMessage({
      message: "O tipo de evento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isUUID()
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.REQUEST__INVALID_NAME,
      message: "Esse tipo de evento não é válido",
    }),
  body("main_subject_id")
    .not()
    .isEmpty()
    .withMessage({
      message: "O assunto principal é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isUUID()
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.REQUEST__INVALID_NAME,
      message: "Esse assunto principal não é válido",
    }),
  body("short_description").not().isEmpty().withMessage({
    message: "A descrição curta do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("venue_type").not().isEmpty().withMessage({
    message: "O tipo do local do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("is_private")
    .not()
    .isEmpty()
    .withMessage({
      message: "A visibilidade do evento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isBoolean()
    .withMessage({
      message: "O formato da visibilidade do evento é inválido",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("start_date").not().isEmpty().withMessage({
    message: "A data de início do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("start_time").not().isEmpty().withMessage({
    message: "A hora de início do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("end_date").not().isEmpty().withMessage({
    message: "A data de fim do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("end_time").not().isEmpty().withMessage({
    message: "A hora de fim do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("responsible_name").not().isEmpty().withMessage({
    message: "O nome do responsável do evento é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("responsible_email")
    .isEmail()
    .withMessage({
      message: "O email do responsável do evento é inválido",
      code: Codes.AUTH__INVALID_EMAIL,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .not()
    .isEmpty()
    .withMessage({
      message: "O email do responsável do evento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  validationMiddleware,
];

export const findById = [
  param("event_id")
    .not()
    .isEmpty()
    .withMessage({
      message: "O id do evento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isUUID()
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.REQUEST__INVALID_NAME,
      message: "Esse id do evento não é válido",
    }),
];
