import { body } from "express-validator";
import { Codes } from "../utils/codes";
import { HttpStatus } from "../utils/httpStatus";
import validationMiddleware from "../utils/middlewares/validations";

export const login = [
  body("email")
    .isEmail()
    .withMessage({
      message: "O email não é válido",
      code: Codes.AUTH__INVALID_EMAIL,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .not()
    .isEmpty()
    .withMessage({
      message: "O email não foi informado",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.AUTH__WEAK_PASSWORD,
      message: "A senha deve conter no mínimo 6 caracteres",
    })
    .not()
    .isEmpty()
    .withMessage({
      message: "A senha não foi informada",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  validationMiddleware,
];

export const register = [
  body("name").not().isEmpty().withMessage({
    message: "O nome não foi informado",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("gender").not().isEmpty().withMessage({
    message: "O gênero não foi informado",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("phone")
    .not()
    .isEmpty()
    .withMessage({
      message: "O número de telfone não foi informado",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isMobilePhone("pt-BR")
    .withMessage({
      message: "O número de telefone inválido",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("email")
    .isEmail()
    .withMessage({
      message: "O email não é válido",
      code: Codes.AUTH__INVALID_EMAIL,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .not()
    .isEmpty()
    .withMessage({
      message: "O email não foi informado",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      code: Codes.AUTH__WEAK_PASSWORD,
      message: "A senha deve conter no mínimo 6 caracteres",
    })
    .not()
    .isEmpty()
    .withMessage({
      message: "A senha não foi informada",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  validationMiddleware,
];
