import { EventTypesRepository } from "../../../repositories/implementations/EventTypesRepository";
import { ListAllEventTypesController } from "./ListAllEventTypesController";
import { ListAllEventTypesUseCase } from "./ListAllEventTypesUseCase";

const eventTypesRepository = new EventTypesRepository();
const listAllEventTypesUseCase = new ListAllEventTypesUseCase(
  eventTypesRepository
);
export const listAllEventTypesController = new ListAllEventTypesController(
  listAllEventTypesUseCase
);
