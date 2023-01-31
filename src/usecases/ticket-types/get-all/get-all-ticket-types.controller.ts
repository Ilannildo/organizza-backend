import { Request, Response } from "express";
import { ITicketPriceTypesRepository } from "../../../repositories/interfaces/ticket-price-type-repository";
import { Codes } from "../../../utils/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";

export class GetAllTicketTypesController {
  constructor(
    private ticketPriceTypesRepository: ITicketPriceTypesRepository
  ) {}

  async handle(request: Request, response: Response) {
    try {
      const types = await this.ticketPriceTypesRepository.findAll();

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
