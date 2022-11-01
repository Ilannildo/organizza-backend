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
      throw new Error("Ops! Esse evento já possui uma capa cadastrada");
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
