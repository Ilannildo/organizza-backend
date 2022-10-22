import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RegisterUserUseCase } from "./RegisterUserUseCase";

export class RegisterUserController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async handle(request: Request, response: Response) {
    const { email, name, password } = request.body;

    try {
      const result = await this.registerUserUseCase.execute({
        user: {
          email,
          name,
          password,
        },
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
