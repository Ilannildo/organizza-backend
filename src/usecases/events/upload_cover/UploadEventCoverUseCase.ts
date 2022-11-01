import { unlink } from "fs";
import path from "path";
import { promisify } from "util";
import { EventCoverModel } from "../../../models/event_cover.model";
import { IEventCoverRepository } from "../../../repositories/interfaces/IEventCoverRepository";
import { UploadEventCoverDTO } from "./UploadEventCoverDTO";

export class UploadEventCoverUseCase {
  constructor(private eventCoverRepository: IEventCoverRepository) {}

  async execute({ event_id, key, name, size, url }: UploadEventCoverDTO) {
    const alreadyExistsByEvent = await this.eventCoverRepository.findByEventId(
      event_id
    );

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
        throw new Error("Não conseguimos atualizar a capa do seu evento");
      }
      const coverUrl = `${process.env.APP_URL}/files/${key}`;
      const newCover = new EventCoverModel({
        event_id,
        key,
        name,
        size,
        url: coverUrl,
      });

      const created = await this.eventCoverRepository.save(newCover);
      return created;
    }

    const coverUrl = `${process.env.APP_URL}/files/${key}`;
    const newCover = new EventCoverModel({
      event_id,
      key,
      name,
      size,
      url: coverUrl,
    });

    const created = await this.eventCoverRepository.save(newCover);
    return created;
  }
}
