import { Request, Response, Router } from "express";
import { getAllSessionBySessionTypeController } from "../usecases/sessions/get-all-session-by-session-type";
import { getAllSessionTypesMenuController } from "../usecases/sessions/get-all-session-types-menu";
import { getSessionTypeByIdController } from "../usecases/sessions/get-session-type-by-id";

export const sessionTypesRoutes = Router();

// todos os estados
sessionTypesRoutes
  .route("/menu")
  .get((request: Request, response: Response) => {
    return getAllSessionTypesMenuController.handle(request, response);
  });

// todos os estados
sessionTypesRoutes
  .route("/:session_type_id")
  .get((request: Request<{ session_type_id: string }>, response: Response) => {
    return getSessionTypeByIdController.handle(request, response);
  });
