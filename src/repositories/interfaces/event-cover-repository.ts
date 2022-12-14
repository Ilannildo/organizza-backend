import { EventCoverModel } from "../../models/event-cover.model";

export interface IEventCoverRepository {
  findById(upload_cover_id: string): Promise<EventCoverModel>;
  findByEventId(event_id: string): Promise<EventCoverModel>;
  findAll(): Promise<EventCoverModel[]>;
  save(cover: EventCoverModel): Promise<EventCoverModel>;
  delete(cover_id: string): Promise<boolean>;
}