import { Response, Router } from "express";
import { createServiceOrderController } from "../usecases/service-order/create-ticket-service-order";
import * as policies from "../utils/policies/v1/users.policy";
import { RequestWithAuth } from "../utils/types";
export const serviceOrderRoutes = Router();

policies.invokeRolesPolicies();

// cadastro de ordem de serviço
serviceOrderRoutes
  .route("/tickets")
  .all(policies.isAllowed)
  .post(
    // eventsValidations.register,
    (request: RequestWithAuth, response: Response) => {
      return createServiceOrderController.handle(request, response);
    }
  );
