import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { CreateEventController } from "./CreateEventController";

const eventRepository = new EventRepository();
export const createEventController = new CreateEventController(eventRepository);
