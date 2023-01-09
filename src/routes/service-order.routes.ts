import { Response, Router } from "express";
import { createServiceOrderController } from "../usecases/service-order/create-ticket-service-order";
import { creditCardValidationBrandController } from "../usecases/service-order/credit-card-validation-brand";
import { getInstallmentsController } from "../usecases/service-order/get-installments";
import { getPaymentMethodController } from "../usecases/service-order/get-payment-method";
import { getServiceOrderController } from "../usecases/service-order/get-service-order";
import { payServiceOrderController } from "../usecases/service-order/pay-service-order";
import { RequestWithAuth } from "../utils/types";

import * as serviceOrderValidations from "../validations/service-order.validation";
import * as policies from "../utils/policies/v1/users.policy";
import { closeServiceOrderController } from "../usecases/service-order/close-service-order";
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

// busca de ordem de serviço
serviceOrderRoutes.route("/payments/:payment_method_id/brand").post(
  // eventsValidations.register,
  (request: RequestWithAuth, response: Response) => {
    return creditCardValidationBrandController.handle(request, response);
  }
);

serviceOrderRoutes
  .route("/:service_order_id/payments/:payment_method_id/installments")
  .get(
    // eventsValidations.register,
    (request: RequestWithAuth, response: Response) => {
      return getInstallmentsController.handle(request, response);
    }
  );

serviceOrderRoutes
  .route("/:service_order_id/pay")
  .all(policies.isAllowed)
  .post(
    serviceOrderValidations.pay,
    (request: RequestWithAuth, response: Response) => {
      return payServiceOrderController.handle(request, response);
    }
  );

serviceOrderRoutes
  .route("/:order_id/close")
  .all(policies.isAllowed)
  .put((request: RequestWithAuth, response: Response) => {
    return closeServiceOrderController.handle(request, response);
  });
