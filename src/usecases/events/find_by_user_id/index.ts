import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { FindEventByUserIdController } from "./FindEventByUserIdController";

const eventRepository = new EventRepository();
export const findEventByUserIdController = new FindEventByUserIdController(
  eventRepository
);
