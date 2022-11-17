import { Request, Response } from "express";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { ListAllCitiesUseCase } from "./ListAllCitiesUseCase";

export class ListAllCitiesController {
  constructor(private listAllCitiesUseCase: ListAllCitiesUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const result = await this.listAllCitiesUseCase.execute();

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
