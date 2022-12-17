import { CityModel } from "../../models/city.model";

export interface ICityRelation {
  relations?: {
    state?: boolean;
    addresses?: boolean;
  };
  where?: {
    is_available_event?: boolean;
  };
}

export interface ICitiesRepository {
  findById(cityId: string): Promise<CityModel>;
  findAll(relation?: ICityRelation): Promise<CityModel[]>;
  save(data: CityModel): Promise<CityModel>;
}
