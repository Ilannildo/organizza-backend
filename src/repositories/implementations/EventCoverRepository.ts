import { EventCoverModel } from "../../models/event_cover.model";
import { client } from "../../prisma/client";
import { IEventCoverRepository } from "../interfaces/IEventCoverRepository";

export class EventCoverRepository implements IEventCoverRepository {
  async findById(upload_cover_id: string): Promise<EventCoverModel> {
    const cover = await client.eventCover.findFirst({
      where: {
        id: upload_cover_id,
      },
    });
    return cover;
  }
  async findByEventId(event_id: string): Promise<EventCoverModel> {
    const cover = await client.eventCover.findFirst({
      where: {
        event_id: event_id,
      },
    });
    return cover;
  }
  async findAll(): Promise<EventCoverModel[]> {
    const cover = await client.eventCover.findMany();
    return cover;
  }
  async save(cover: EventCoverModel): Promise<EventCoverModel> {
    const created = await client.eventCover.create({
      data: {
        key: cover.key,
        name: cover.name,
        size: cover.size,
        url: cover.url,
        event: {
          connect: {
            id: cover.event_id,
          },
        },
      },
    });
    return created;
  }
  async delete(event_id: string): Promise<boolean> {
    const deleteCover = await client.eventCover.delete({
      where: {
        event_id,
      },
    });

    return !!deleteCover;
  }
}
