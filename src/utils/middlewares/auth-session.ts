import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { Codes } from "../codes";
import { sendError } from "../formatters/responses";
import { HttpStatus } from "../httpStatus";

export function authSessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const autheticationPaths = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/confirm-email",
    "/api/event-page",
    "/api/event-page/tickets",
    "/api/event-page/sessions",
  ];
  const filesPath = "/files";

  if (autheticationPaths.includes(req.path) || req.path.includes(filesPath)) {
    return next();
  }
  const authToken = req.headers.authorization;

  if (!authToken) {
    return sendError(
      res,
      Codes.AUTH__UNEXPECTED_AUTHORIZATION,
      "Sua sessão foi encerrada",
      HttpStatus.UNAUTHORIZED
    );
  }

  const [, token] = authToken.split(" ");
  try {
    const payload = verify(token, process.env.SECRET_KEY);
    req.body.user = payload;
    next();
  } catch (error) {
    if (error.message !== "jwt expired") {
      return sendError(
        res,
        Codes.AUTH__UNEXPECTED_AUTHORIZATION,
        "Invalid token",
        HttpStatus.UNAUTHORIZED
      );
    }
    return sendError(
      res,
      Codes.AUTH__USER_NOT_AUTHORIZED,
      "Você não tem permissão para acessar essa área",
      HttpStatus.LOCKED
    );
  }
}
