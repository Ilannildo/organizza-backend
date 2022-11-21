import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { FindEventUseCase } from "./FindEventUseCase";

export class FindEventController {
  constructor(private findEventUseCase: FindEventUseCase) {}

  async handle(request: Request, response: Response) {
    const { slug } = request.query;
    const slugString = String(slug);

    try {
      const result = await this.findEventUseCase.execute({
        slug: slugString,
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
