import { AddressModel } from "./address.model";
import { UserModel } from "./user.model";

export class UserHasAddressModel {
  public user_id: string;
  public address_id: string;
  public user?: UserModel;
  public address?: AddressModel;

  constructor(props: UserHasAddressModel) {
    Object.assign(this, props);
  }
}
