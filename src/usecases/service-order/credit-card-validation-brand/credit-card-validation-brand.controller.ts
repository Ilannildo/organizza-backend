import { Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { RequestWithAuth } from "../../../utils/types";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { checkCreditCard } from "./credit-card-validation-brand.service";

export class CreditCardValidationBrandController {
  constructor() {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      // recebe o body da requisição
      const { hash } = request.body;

      if (!hash) {
        return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
      }

      const first_six_digits = hash;

      if (!first_six_digits) {
        return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
      }

      const creditCardResult = checkCreditCard(first_six_digits);

      return sendSuccessful(response, creditCardResult, HttpStatus.OK);
    } catch (error) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
