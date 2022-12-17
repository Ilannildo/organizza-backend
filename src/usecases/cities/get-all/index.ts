import { PrismaCityRepository } from "../../../repositories/implementations/prisma-city.repository";
import { GetAllCitiesController } from "./get-all-cities.controller";

const prismaCityRepository = new PrismaCityRepository();
export const getAllCitiesController = new GetAllCitiesController(
  prismaCityRepository
);
