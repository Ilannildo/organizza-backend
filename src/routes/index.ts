import { Request, Response, Router } from "express";
import { authUserController } from "../usecases/users/auth";
import { meUserController } from "../usecases/users/me";
import * as policies from "../usecases/users/utils/policies/v1/users.policy";
import { RequestWithAuth } from "../utils/types";

export const routes = Router();

policies.invokeRolesPolicies();

// efetua o login do usuário
routes.route("/api/auth/login").post((request: Request, response: Response) => {
  return authUserController.handle(request, response);
});

routes
  .route("/api/me")
  .all(policies.isAllowed)
  .get((request: RequestWithAuth, response: Response) => {
    return meUserController.handle(request, response);
  });
