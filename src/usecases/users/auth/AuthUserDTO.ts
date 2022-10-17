import { User } from "../../../models/User";


export interface IAuthenticateUseRequest {
  email: string;
  password: string;
}

export interface IAuthenticateUseResponse {
  access_token: string;
  user: User;
}
