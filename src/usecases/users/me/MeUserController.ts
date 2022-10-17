import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { MeUserUseCase } from "./MeUserUseCase";

export class MeUserController {
  constructor(private meUserUseCase: MeUserUseCase) {}

  async handle(request: RequestWithAuth, response: Response) {
    try {
      const result = await this.meUserUseCase.execute({
        uid: request.user.uid,
      });

      return responses.sendSuccessful(response, result);
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
