import { Request, Response, Router } from "express";
import { getSubscriptionByIdController } from "../usecases/subscriptions/get-subscription-by-id";

export const subscriptionRoutes = Router();

// todos os estados
subscriptionRoutes
  .route("/:subscription_id")
  .get((request: Request<{ subscription_id: string }>, response: Response) => {
    return getSubscriptionByIdController.handle(request, response);
  });
