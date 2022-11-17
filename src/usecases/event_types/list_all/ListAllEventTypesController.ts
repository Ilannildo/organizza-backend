import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { ListAllEventTypesUseCase } from "./ListAllEventTypesUseCase";

export class ListAllEventTypesController {
  constructor(private listAllEventTypesUseCase: ListAllEventTypesUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const result = await this.listAllEventTypesUseCase.execute();

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
