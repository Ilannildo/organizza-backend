import { Request, Response, Router } from "express";
import { authUserController } from "../usecases/users/auth";
import { meUserController } from "../usecases/users/me";
import { registerUserController } from "../usecases/users/register";
import * as policies from "../utils/policies/v1/users.policy";
import { RequestWithAuth } from "../utils/types";

import * as usersValidations from "../validations/users.validation";

export const routes = Router();

policies.invokeRolesPolicies();

// efetua o login do usuário
routes
  .route("/api/auth/login")
  .post(usersValidations.login, (request: Request, response: Response) => {
    return authUserController.handle(request, response);
  });

// efetua o cadastro do usuário
routes
  .route("/api/auth/register")
  .post(usersValidations.register, (request: Request, response: Response) => {
    return registerUserController.handle(request, response);
  });

routes
  .route("/api/me")
  .all(policies.isAllowed)
  .get((request: RequestWithAuth, response: Response) => {
    return meUserController.handle(request, response);
  });
