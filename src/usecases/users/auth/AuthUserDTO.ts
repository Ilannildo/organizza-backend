import { UserModel } from "../../../models/user.model";



export interface IAuthenticateUseRequest {
  email: string;
  password: string;
}

export interface IAuthenticateUseResponse {
  access_token: string;
  user: UserModel;
}
