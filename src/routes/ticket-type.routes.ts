import { Request, Response, Router } from "express";
import { getAllTicketTypesController } from "../usecases/ticket-types/get-all";

export const ticketTypeRoute = Router();

// todos os tipos de preços dos ingressos
ticketTypeRoute.route("").get((request: Request, response: Response) => {
  return getAllTicketTypesController.handle(request, response);
});
