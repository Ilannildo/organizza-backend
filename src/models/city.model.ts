import { v4 as uuid } from "uuid";
import { AddressModel } from "./address.model";
import { StateModel } from "./state.model";

export class CityModel {
  public readonly id: string;
  public name: string;
  public zipcode: string;
  public state_id: string;
  public is_available_event: boolean;
  public created_at?: Date;
  public updated_at?: Date;
  public state?: StateModel;
  public addresses?: AddressModel[];

  constructor(props: Omit<CityModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
