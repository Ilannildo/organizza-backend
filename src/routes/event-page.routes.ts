import { Request, Response, Router } from "express";
import { getAllEventPageTicketController } from "../usecases/event-page/get-all-tickets";
import { getEventPageController } from "../usecases/event-page/get-event";
import { getAllEventPageSessionsController } from "../usecases/event-page/get-sessions";

export const eventPageRoutes = Router();

// busca os tickets do evento
eventPageRoutes
  .route("/tickets")
  .get((request: Request, response: Response) => {
    return getAllEventPageTicketController.handle(request, response);
  });

// busca o evento
eventPageRoutes.route("").get((request: Request, response: Response) => {
  return getEventPageController.handle(request, response);
});

// busca as sessões do evento
eventPageRoutes
  .route("/sessions")
  .get((request: Request, response: Response) => {
    return getAllEventPageSessionsController.handle(request, response);
  });
