import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { AuthUserUseCase } from "./AuthUserUseCase";

export class AuthenticateUserController {
  constructor(private authUserUseCase: AuthUserUseCase) {}

  async handle(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const result = await this.authUserUseCase.execute({
        email,
        password,
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
