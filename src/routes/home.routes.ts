import { Request, Response, Router } from "express";

import { getRelevanceEventsController } from "../usecases/home/get-relevance-event";

export const homeRoutes = Router();

// efetua o login do usuário
homeRoutes
  .route("/relevance-events")
  .get((request: Request, response: Response) => {
    return getRelevanceEventsController.handle(request, response);
  });
