import { Response, Router } from "express";
import { createServiceOrderController } from "../usecases/service-order/create-ticket-service-order";
import { getPaymentMethodController } from "../usecases/service-order/get-payment-method";
import { getServiceOrderController } from "../usecases/service-order/get-service-order";
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

// busca de ordem de serviço
serviceOrderRoutes
  .route("/:service_order_id")
  .all(policies.isAllowed)
  .get(
    // eventsValidations.register,
    (request: RequestWithAuth, response: Response) => {
      return getServiceOrderController.handle(request, response);
    }
  );

// busca de ordem de serviço
serviceOrderRoutes.route("/:service_order_id/payment-methods").get(
  // eventsValidations.register,
  (request: RequestWithAuth, response: Response) => {
    return getPaymentMethodController.handle(request, response);
  }
);
