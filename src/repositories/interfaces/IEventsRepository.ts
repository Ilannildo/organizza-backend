import { EventModel } from "../../models/event.model";
import { EventResponsibleModel } from "../../models/event_responsible.model";

export interface IEventsRepository {
  findById(eventId: string): Promise<EventModel>;
  findByTitle(title: string): Promise<EventModel>;
  findAll(): Promise<EventModel[]>;
  save(
    data: EventModel,
    responsible: EventResponsibleModel
  ): Promise<EventModel>;
}
