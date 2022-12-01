import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { FindEventController } from "./FindEventController";

const eventRepository = new EventRepository();
export const findEventController = new FindEventController(eventRepository);