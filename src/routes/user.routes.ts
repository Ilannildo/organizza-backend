import { Response, Router } from "express";
import { findEventByUserIdController } from "../usecases/events/get-by-user-id";
import { userAccountController } from "../usecases/users/account";
import { RequestWithAuth } from "../utils/types";

import { getUserSubscriptionsController } from "../usecases/subscriptions/get-user-subscriptions";
import * as policies from "../utils/policies/v1/users.policy";

export const userRoutes = Router();

// busca os dados do usuário logado
userRoutes
  .route("/account")
  .all(policies.isAllowed)
  .get((request: RequestWithAuth, response: Response) => {
    return userAccountController.handle(request, response);
  });

// buscar eventos criados pelo usuário
userRoutes
  .route("/events")
  .all(policies.isAllowed)
  .get((request: RequestWithAuth, response: Response) => {
    return findEventByUserIdController.handle(request, response);
  });

// buscar eventos criados pelo usuário
userRoutes
  .route("/subscriptions")
  .get((request: RequestWithAuth, response: Response) => {
    return getUserSubscriptionsController.handle(request, response);
  });
