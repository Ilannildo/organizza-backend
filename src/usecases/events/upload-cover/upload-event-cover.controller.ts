import { Response } from "express";
import { unlink } from "fs";
import path from "path";
import { promisify } from "util";

import { EventCoverModel } from "../../../models/event-cover.model";
import { IEventCoverRepository } from "../../../repositories/interfaces/event-cover-repository";
import { Codes } from "../../../utils/codes";
import { HttpStatus } from "../../../utils/httpStatus";
import { RequestWithAuth } from "../../../utils/types";

import * as responses from "../../../utils/formatters/responses";

export class UploadEventCoverController {
  constructor(private eventCoverRepository: IEventCoverRepository) {}

  async handle(request: RequestWithAuth, response: Response) {
    const { event_id } = request.params;
    const { fieldname, filename, size } = request.file;

    try {
      const alreadyExistsByEvent =
        await this.eventCoverRepository.findByEventId(event_id);

      if (alreadyExistsByEvent) {
        if (
          path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "tmp",
            "uploads",
            alreadyExistsByEvent.key
          )
        ) {
          promisify(unlink)(
            path.resolve(
              __dirname,
              "..",
              "..",
              "..",
              "..",
              "tmp",
              "uploads",
              alreadyExistsByEvent.key
            )
          );
        }
        const deleteCover = await this.eventCoverRepository.delete(event_id);
        if (!deleteCover) {
          return responses.sendError(
            response,
            Codes.UNKNOWN_ERROR,
            "Ocorreu um erro ao atualizar a capa do evento",
            HttpStatus.UNPROCESSABLE_ENTITY
          );
        }
        const coverUrl = `${process.env.APP_URL}/files/${filename}`;
        const newCover = new EventCoverModel({
          event_id,
          key: filename,
          name: fieldname,
          size,
          url: encodeURIComponent(coverUrl),
        });

        const created = await this.eventCoverRepository.save(newCover);
        return responses.sendSuccessful(response, created);
      }
      const coverUrl = `${process.env.APP_URL}/files/${filename}`;
      const newCover = new EventCoverModel({
        event_id,
        key: filename,
        name: fieldname,
        size,
        url: coverUrl,
      });

      const created = await this.eventCoverRepository.save(newCover);
      return responses.sendSuccessful(response, created);
    } catch (error) {
      if (
        path.resolve(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "tmp",
          "uploads",
          filename
        )
      ) {
        promisify(unlink)(
          path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "tmp",
            "uploads",
            filename
          )
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
