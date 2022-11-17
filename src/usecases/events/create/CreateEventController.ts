import { Request, Response } from "express";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { CreateEventUseCase } from "./CreateEventUseCase";
import { RequestWithAuth } from "../../../utils/types";

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}
  async handle(request: RequestWithAuth, response: Response) {
    try {
      const {
        title,
        event_type_id,
        main_subject_id,
        short_description,
        venue_type,
        is_private,
        start_date,
        start_time,
        end_date,
        end_time,
        address,
        city_id,
        responsible_name,
        responsible_email,
      } = request.body;
      const result = await this.createEventUseCase.execute({
        response,
        event: {
          title,
          created_by_user_id: request.user.uid,
          event_type_id,
          main_subject_id,
          short_description,
          venue_type,
          is_private,
          start_date: new Date(start_date),
          start_time: new Date(start_time),
          end_date: new Date(end_date),
          end_time: new Date(end_time),
          address,
          city_id,
          responsible_name,
          responsible_email,
        },
      });
      return sendSuccessful(response, result);
    } catch (error) {
      if (error.message === Codes.CONFLICTING_CONDITION) {
        return sendError(
          response,
          Codes.CONFLICTING_CONDITION,
          "Já existe um evento com esse título",
          HttpStatus.CONFLICT
        );
      }
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
