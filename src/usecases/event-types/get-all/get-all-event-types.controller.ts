import { Request, Response } from "express";
import { IEventTypesRepository } from "../../../repositories/interfaces/event-type-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

export class GetAllEventTypesController {
  constructor(private eventTypesRepository: IEventTypesRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const types = await this.eventTypesRepository.findAll();

      if (!types) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Nenhuma tipo de evento encontrado. Entre em contato com o suporte",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return sendSuccessful(response, types);
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
