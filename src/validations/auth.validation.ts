import { body } from "express-validator";
import { Codes } from "../utils/codes";
import { HttpStatus } from "../utils/httpStatus";
import validationMiddleware from "../utils/middlewares/validations";

export const confirmEmail = [
  body("code").not().isEmpty().withMessage({
    message: "Código de confirmação não foi repassado",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  validationMiddleware,
];
