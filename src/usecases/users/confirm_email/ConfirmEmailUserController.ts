import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { ConfirmEmailUserUseCase } from "./ConfirmEmailUserUseCase";

export class ConfirmEmailUserController {
  constructor(private confirmEmailUserUseCase: ConfirmEmailUserUseCase) {}

  async handle(request: RequestWithAuth, response: Response) {
    const { code } = request.body;
    try {
      const result = await this.confirmEmailUserUseCase.execute({
        code,
      });

      return responses.sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
    } catch (error) {
      return responses.sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
