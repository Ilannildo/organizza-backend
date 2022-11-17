import { EventTypeModel } from "../../models/event_type.model";
import { client } from "../../prisma/client";
import { IEventTypesRepository } from "../interfaces/IEventTypesRepository";

export class EventTypesRepository implements IEventTypesRepository {
  findById(eventTypeId: string): Promise<EventTypeModel> {
    throw new Error("Method not implemented.");
  }
  async findAll(): Promise<EventTypeModel[]> {
    const types = await client.eventType.findMany();
    return types;
  }
  save(data: EventTypeModel): Promise<EventTypeModel> {
    throw new Error("Method not implemented.");
  }
}
