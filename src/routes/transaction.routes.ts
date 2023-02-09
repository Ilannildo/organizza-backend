import { Response, Router } from "express";
import { updatePaymentTransactionController } from "../usecases/transactions/update-payment-transaction";
import { RequestWithAuth } from "../utils/types";

export const transactionRoutes = Router();

transactionRoutes
  .route("/pagarme/webhook/order")
  .post((request: RequestWithAuth, response: Response) => {
    return updatePaymentTransactionController.handle(request, response);
  });
