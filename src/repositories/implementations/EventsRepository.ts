import { EventModel } from "../../models/event.model";
import { EventResponsibleModel } from "../../models/event_responsible.model";
import { client } from "../../prisma/client";
import { IEventsRepository } from "../interfaces/IEventsRepository";

export class EventRepository implements IEventsRepository {
  findById(eventId: string): Promise<EventModel> {
    throw new Error("Method not implemented.");
  }
  async findByTitle(title: string): Promise<EventModel> {
    const event = await client.event.findFirst({
      where: {
        title,
      },
    });

    return event;
  }
  findAll(): Promise<EventModel[]> {
    throw new Error("Method not implemented.");
  }
  async save(
    data: EventModel,
    responsible: EventResponsibleModel
  ): Promise<EventModel> {
    const created = await client.event.create({
      data: {
        title: data.title,
        short_description: data.short_description,
        venue_type: data.venue_type,
        is_private: data.is_private,
        start_date: data.start_date,
        start_time: data.start_time,
        end_date: data.end_date,
        end_time: data.end_time,
        slug: data.slug,
        status: data.status,
        created_by_user: {
          connect: {
            uid: data.created_by_user_id,
          },
        },
        event_type: {
          connect: {
            id: data.event_type_id,
          },
        },
        main_subject: {
          connect: {
            id: data.main_subject_id,
          },
        },
        event_responsible: {
          connectOrCreate: {
            create: responsible,
            where: {
              email: responsible.email,
            },
          },
        },
      },
    });
    return created;
  }

  async findBySlug(slug: string): Promise<EventModel> {
    const event = await client.event.findFirst({
      where: {
        slug,
      },
    });
    return event;
  }
}
