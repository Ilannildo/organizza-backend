import { StateModel } from "../../models/state.model";

export interface IStateRelation {
  relations?: {
    cities?: boolean;
  };
}

export interface IStatesRepository {
  findById(stateId: string): Promise<StateModel>;
  findAll(relation?: IStateRelation): Promise<StateModel[]>;
  save(data: StateModel): Promise<StateModel>;
}
