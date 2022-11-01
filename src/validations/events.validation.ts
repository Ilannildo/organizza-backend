import { body, check } from "express-validator";
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
