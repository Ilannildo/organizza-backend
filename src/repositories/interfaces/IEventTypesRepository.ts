import { EventTypeModel } from "../../models/event_type.model";

export interface IEventTypesRepository {
  findById(eventTypeId: string): Promise<EventTypeModel>;
  findAll(): Promise<EventTypeModel[]>;
  save(data: EventTypeModel): Promise<EventTypeModel>;
}
