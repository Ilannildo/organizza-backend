import { EventModel } from "../../models/event.model";
import { EventResponsibleModel } from "../../models/event-responsible.model";

export interface IEventsRepository {
  findById(event_id: string): Promise<EventModel>;
  findByUserId({
    user_id,
    limit,
    page,
  }: {
    user_id: string;
    page: number;
    limit: number;
  }): Promise<[number, EventModel[]]>;
  findByTitle(title: string): Promise<EventModel>;
  findBySlug(slug: string): Promise<EventModel>;
  findAll(): Promise<EventModel[]>;
  update(data: EventModel): Promise<EventModel>;
  save(
    data: EventModel,
    responsible: EventResponsibleModel
  ): Promise<EventModel>;
}
