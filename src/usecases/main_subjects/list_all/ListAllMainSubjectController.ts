import { Request, Response } from "express";
import { IMainSubjectRepository } from "../../../repositories/interfaces/IMainSubjectRepository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

export class ListAllMainSubjectController {
  constructor(private mainSubjectRepository: IMainSubjectRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const subjects = await this.mainSubjectRepository.findAll();

    if (!subjects) {
      return sendError(
        response,
        Codes.ENTITY__NOT_FOUND,
        "Nenhuma assunto principal encontrado. Entre em contato com o suporte",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

      return sendSuccessful(response, subjects);
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
