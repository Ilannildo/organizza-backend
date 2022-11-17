import { v4 as uuid } from "uuid";
import { CityModel } from "./city.model";
import { EventHasAddressModel } from "./event_has_address.model";
import { UserHasAddressModel } from "./user_has_address.model";

export class AddressModel {
  public readonly id: string;
  public street: string;
  public reference?: string;
  public neighborhood?: string;
  public city_id: string;
  public latitude?: string;
  public longitude?: string;
  public address_link?: string;
  public created_at?: Date;
  public updated_at?: Date;
  public city?: CityModel;
  public user_has_address?: UserHasAddressModel;
  public event_has_address?: EventHasAddressModel;

  constructor(props: Omit<AddressModel, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
