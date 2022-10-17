import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type RequestWithAuth = Request & {
  user_auth: JwtPayload & {
    user_id?: string;
  };
};
