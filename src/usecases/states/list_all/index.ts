import { StatesRepository } from "../../../repositories/implementations/StatesRepository";
import { ListAllStatesController } from "./ListAllStatesController";

const statesRepository = new StatesRepository();
export const listAllStatesController = new ListAllStatesController(statesRepository);