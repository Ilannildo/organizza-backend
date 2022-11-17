import { v4 as uuid } from "uuid";
import { CityModel } from "./city.model";

export class StateModel {
  public readonly id: string;
  public name: string;
  public uf: string;
  public created_at?: Date;
  public updated_at?: Date;
  public cities?: CityModel[];

  constructor(props: Omit<StateModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
