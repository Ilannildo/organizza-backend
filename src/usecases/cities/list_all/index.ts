import { CitiesRepository } from "../../../repositories/implementations/CitiesRepository";
import { ListAllCitiesController } from "./ListAllCitiesController";
import { ListAllCitiesUseCase } from "./ListAllCitiesUseCase";

const citiesRepository = new CitiesRepository();
const listAllCitiesUseCase = new ListAllCitiesUseCase(citiesRepository);
export const listAllCitiesController = new ListAllCitiesController(listAllCitiesUseCase);