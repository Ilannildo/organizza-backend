import multer from "multer";
import { Request, Response, Router } from "express";
import { uploadEventCoverController } from "../usecases/events/upload_cover";
import { registerUserController } from "../usecases/users/register";
import { authUserController } from "../usecases/users/auth";
import { meUserController } from "../usecases/users/me";
import { RequestWithAuth } from "../utils/types";
import { multerConfigs } from "../config/multer";

import * as policies from "../utils/policies/v1/users.policy";
import * as usersValidations from "../validations/users.validation";
import * as eventsValidations from "../validations/events.validation";

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

routes
  .route("/api/events/cover")
  .all(policies.isAllowed, multer(multerConfigs).single("cover"))
  .post(
    eventsValidations.upload_cover,
    (request: RequestWithAuth, response: Response) => {
      return uploadEventCoverController.handle(request, response);
    }
  );
