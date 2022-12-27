import { Request, Response } from "express";
import { ISessionTypeRepository } from "../../../repositories/interfaces/session-type-repository";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { Codes } from "../../../utils/codes";
import { IGetAllSessionTypesMenuResponse } from "./get-all-session-types-menu.dto";

export class GetAllSessionTypesMenuController {
  constructor(private sessionTypeRepository: ISessionTypeRepository) {}

  async handle(request: Request, response: Response) {
    try {
      const sessionTypesMenu = await this.sessionTypeRepository.findAllMenu();

      const sessionTypesResponse: IGetAllSessionTypesMenuResponse[] = [];
      sessionTypesMenu.forEach((sessionType) => {
        sessionTypesResponse.push({
          breadcrumbs: false,
          id: sessionType.id,
          title: sessionType.title,
          type: "item",
          url: `programacao/${sessionType.id}`,
        });
      });

      return sendSuccessful(response, sessionTypesResponse, HttpStatus.OK);
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
