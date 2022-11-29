import { EventRepository } from "../../../repositories/implementations/EventsRepository";
import { FindEventByIdController } from "./FindEventByIdController";
import { FindEventByIdUseCase } from "./FindEventByIdUseCase";

const eventRepository = new EventRepository();
const findEventByIdUseCase = new FindEventByIdUseCase(eventRepository);
export const findEventByIdController = new FindEventByIdController(findEventByIdUseCase);