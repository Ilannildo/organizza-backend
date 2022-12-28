import { Request, Response } from "express";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";

export class GetSessionTypeByIdController {
  constructor(private sessionTypeRepository: ISessionTypeRepository) {}

  async handle(
    request: Request<{ session_type_id: string }>,
    response: Response
  ) {
    const { session_type_id } = request.params;
    try {
      const sessionType = await this.sessionTypeRepository.findById({
        session_type_id,
      });

      if (!sessionType) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa sessão não existe",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      if (!sessionType.is_active) {
        return sendError(
          response,
          Codes.ENTITY__NOT_FOUND,
          "Essa sessão pode está desativada",
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      return sendSuccessful(response, sessionType, HttpStatus.OK);
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
