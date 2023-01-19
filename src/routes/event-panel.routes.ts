import { Request, Response, Router } from "express";
import { getAllEventPageTicketController } from "../usecases/event-page/get-all-tickets";
import { getEventPageController } from "../usecases/event-page/get-event";
import { getAllEventPageSessionsController } from "../usecases/event-page/get-sessions";
import { getEventByIdController } from "../usecases/event-panel/get-event-by-id";
import { getEventPanelSalesController } from "../usecases/event-panel/get-event-panel-sales";
import { getEventPanelTicketInformationController } from "../usecases/event-panel/get-event-panel-ticket-information";

export const eventPanelRoutes = Router();

// busca os dados do evento
eventPanelRoutes
  .route("/:event_id")
  .get((request: Request<{ event_id: string }>, response: Response) => {
    return getEventByIdController.handle(request, response);
  });
// busca os dados do evento
eventPanelRoutes
  .route("/:event_id/ticket-information")
  .get((request: Request<{ event_id: string }>, response: Response) => {
    return getEventPanelTicketInformationController.handle(request, response);
  });
// busca os dados do evento
eventPanelRoutes
  .route("/:event_id/sales")
  .get((request: Request<{ event_id: string }>, response: Response) => {
    return getEventPanelSalesController.handle(request, response);
  });
