import { CitiesRepository } from "../../../repositories/implementations/CitiesRepository";
import { ListAllCitiesController } from "./ListAllCitiesController";

const citiesRepository = new CitiesRepository();
export const listAllCitiesController = new ListAllCitiesController(citiesRepository);