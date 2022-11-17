import { StatesRepository } from "../../../repositories/implementations/StatesRepository";
import { ListAllStatesController } from "./ListAllStatesController";
import { ListAllStatesUseCase } from "./ListAllStatesUseCase";

const statesRepository = new StatesRepository();
const listAllStatesUseCase = new ListAllStatesUseCase(statesRepository);
export const listAllStatesController = new ListAllStatesController(listAllStatesUseCase);