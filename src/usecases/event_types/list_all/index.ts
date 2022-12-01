import { EventTypesRepository } from "../../../repositories/implementations/EventTypesRepository";
import { ListAllEventTypesController } from "./ListAllEventTypesController";

const eventTypesRepository = new EventTypesRepository();
export const listAllEventTypesController = new ListAllEventTypesController(
  eventTypesRepository
);
