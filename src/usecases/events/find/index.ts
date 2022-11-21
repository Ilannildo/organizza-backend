import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { FindEventController } from "./FindEventController";
import { FindEventUseCase } from "./FindEventUseCase";

const eventRepository = new EventRepository();
const findEventUseCase = new FindEventUseCase(eventRepository);
export const findEventController = new FindEventController(findEventUseCase);