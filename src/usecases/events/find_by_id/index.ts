import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { FindEventByIdController } from "./FindEventByIdController";

const eventRepository = new EventRepository();
export const findEventByIdController = new FindEventByIdController(eventRepository);