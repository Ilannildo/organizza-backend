import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { ErrorHandler } from "../types/utils/errorHandler";


export function handleJWTAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  passport.authenticate(
    "jwt",
    { session: false },
    function (err: ErrorHandler, user, info) {
      if (err) return next(err);
      request.user = user;
      if (info) {
        // @ts-ignore disable
        request.err = info.message;
      }
      next();
    }
  )(request, response, next);
}