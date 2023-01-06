import { Request } from "express";
import { UserModel } from "../../models/user.model";

export type RequestWithAuth = Request & {
  user: UserModel;
};
