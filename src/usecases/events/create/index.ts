import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { CreateEventController } from "./CreateEventController";
import { CreateEventUseCase } from "./CreateEventUseCase";

const eventRepository = new EventRepository();
const createEventUseCase = new CreateEventUseCase(eventRepository);
export const createEventController = new CreateEventController(
  createEventUseCase
);
