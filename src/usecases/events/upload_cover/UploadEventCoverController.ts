import { Request, Response } from "express";
import { unlink } from "fs";
import path from "path";
import { promisify } from "util";
import { Codes } from "../../../utils/codes";
import * as responses from "../../../utils/formatters/responses";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";
import { UploadEventCoverUseCase } from "./UploadEventCoverUseCase";

export class UploadEventCoverController {
  constructor(private uploadEventCoverUseCase: UploadEventCoverUseCase) {}

  async handle(request: RequestWithAuth, response: Response) {
    const { event_id } = request.body;
    const { fieldname, filename, size } = request.file;

    try {
      const result = await this.uploadEventCoverUseCase.execute({
        event_id,
        key: filename,
        name: fieldname,
        size,
      });

      return responses.sendSuccessful(response, result);
    } catch (error) {
      //if error, delete cover uploaded
      if (
        path.resolve(__dirname, "..", "..", "..", '..', "tmp", "uploads", filename)
      ) {
        promisify(unlink)(
          path.resolve(__dirname, "..", "..", "..", '..', "tmp", "uploads", filename)
        );
      }
      return responses.sendError(
        response,
        Codes.UNKNOWN_ERROR,
        error.message || "Unexpected error",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
  }
}
