import { Request, Response, Router } from "express";
import { getAllEventTypesController } from "../usecases/event-types/get-all";

export const eventTypesRoutes = Router();

// todos os tipos de eventos
eventTypesRoutes.route("").get((request: Request, response: Response) => {
  return getAllEventTypesController.handle(request, response);
});
