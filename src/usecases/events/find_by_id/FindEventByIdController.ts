import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { FindEventByIdUseCase } from "./FindEventByIdUseCase";

export class FindEventByIdController {
  constructor(private findEventByIdUseCase: FindEventByIdUseCase) {}

  async handle(request: Request, response: Response) {
    const { event_id } = request.params;

    try {
      const result = await this.findEventByIdUseCase.execute({
        event_id,
      });

      return sendSuccessful(response, result);
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
