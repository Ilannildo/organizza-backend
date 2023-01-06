import { Request, Response, Router } from "express";
import { confirmUserAccountController } from "../usecases/users/confirm-account";
import { registerUserController } from "../usecases/users/register";
import { authUserController } from "../usecases/users/auth";
import { RequestWithAuth } from "../utils/types";

import * as authValidations from "../validations/auth.validation";

export const authRoutes = Router();

// efetua o login do usuário
authRoutes
  .route("/login")
  .post(authValidations.login, (request: Request, response: Response) => {
    return authUserController.handle(request, response);
  });

// efetua o cadastro do usuário
authRoutes
  .route("/register")
  .post(authValidations.register, (request: Request, response: Response) => {
    return registerUserController.handle(request, response);
  });

// confirmar conta
authRoutes
  .route("/confirm-email")
  .post(
    authValidations.confirmEmail,
    (request: RequestWithAuth, response: Response) => {
      return confirmUserAccountController.handle(request, response);
    }
  );
