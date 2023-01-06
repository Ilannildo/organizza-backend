import { CityModel } from "../../models/city.model";
import { client } from "../../prisma/client";
import {
  ICitiesRepository,
  ICityRelation,
} from "../interfaces/city-repository";

export class PrismaCityRepository implements ICitiesRepository {
  findById(cityId: string): Promise<CityModel> {
    throw new Error("Method not implemented.");
  }
  async findAll({ relations, where }: ICityRelation): Promise<CityModel[]> {
    const cities = await client.city.findMany({
      where: {
        ...where,
      },
      include: {
        ...relations,
      },
    });
    return cities;
  }
  save(data: CityModel): Promise<CityModel> {
    throw new Error("Method not implemented.");
  }
}
