import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../../models/user.model";

export type RequestWithAuth = Request & {
  user: UserModel;
};

export interface ConfigAssetsObject {
  allJS: [string];
  models: [string];
  routes: [string];
  configs: [string];
  policies: [string];
  sockets: [string];
  typedefs: [string];
  resolvers: [string];
  validations: [string];

  i18n: string;
}
