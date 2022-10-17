import { Request, Response, Router } from "express";
import { authUserController } from "../usecases/users/auth";

export const routes = Router();

// efetua o login do usuário
routes.route("/api/auth/login").post((request: Request, response: Response) => {
  return authUserController.handle(request, response);
});
