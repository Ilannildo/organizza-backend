import { Request, Response } from "express";
import { IStatesRepository } from "../../../repositories/interfaces/IStatesRepository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

export class ListAllStatesController {
  constructor(private statesRepository: IStatesRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const states = await this.statesRepository.findAll({
        relations: {
          cities: false,
        },
      });

      if (!states) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Nenhum estado encontrado. Entre em contato com o suporte",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
      return sendSuccessful(response, states);
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
