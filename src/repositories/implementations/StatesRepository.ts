import { CityModel } from "../../models/city.model";
import { StateModel } from "../../models/state.model";
import { client } from "../../prisma/client";
import {
  IStateRelation,
  IStatesRepository,
} from "../interfaces/IStatesRepository";

export class StatesRepository implements IStatesRepository {
  findById(stateId: string): Promise<StateModel> {
    throw new Error("Method not implemented.");
  }
  async findAll({ relations }: IStateRelation): Promise<StateModel[]> {
    const states = await client.state.findMany({
      include: {
        ...relations,
      },
    });
    return states;
  }
  save(data: StateModel): Promise<StateModel> {
    throw new Error("Method not implemented.");
  }
}
