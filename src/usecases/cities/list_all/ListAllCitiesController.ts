import { Request, Response } from "express";
import { ICitiesRepository } from "../../../repositories/interfaces/ICitiesRepository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

export class ListAllCitiesController {
  constructor(private citiesRepository: ICitiesRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const cities = await this.citiesRepository.findAll({
        relations: {
          state: true,
        },
        where: {
          is_available_event: true,
        },
      });

      if (!cities) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Nenhuma cidade encontrada. Entre em contato com o suporte",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return sendSuccessful(response, cities);
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
