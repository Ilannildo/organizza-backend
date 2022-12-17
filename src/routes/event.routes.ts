import { Request, Response, Router } from "express";
import multer from "multer";

import { uploadEventCoverController } from "../usecases/events/upload-cover";
import { createTicketController } from "../usecases/tickets/create";
import { findEventByIdController } from "../usecases/events/get-by-id";
import { findEventController } from "../usecases/events/get-by-slug";
import { createEventController } from "../usecases/events/create";
import { RequestWithAuth } from "../utils/types";
import { multerConfigs } from "../config/multer";

import * as eventsValidations from "../validations/events.validation";
import * as policies from "../utils/policies/v1/users.policy";

export const eventRoutes = Router();

policies.invokeRolesPolicies();

// cadastro de eventos
eventRoutes
  .route("")
  .all(policies.isAllowed)
  .post(
    eventsValidations.register,
    (request: RequestWithAuth, response: Response) => {
      return createEventController.handle(request, response);
    }
  );

// buscar evento pelo id
eventRoutes
  .route("")
  .all(policies.isAllowed)
  .get(
    eventsValidations.findById,
    (request: RequestWithAuth, response: Response) => {
      return findEventByIdController.handle(request, response);
    }
  );

// efetua o upload da capa do evento
eventRoutes
  .route("/cover")
  .all(policies.isAllowed, multer(multerConfigs).single("cover"))
  .post(
    eventsValidations.upload_cover,
    (request: RequestWithAuth, response: Response) => {
      return uploadEventCoverController.handle(request, response);
    }
  );

// efetua a criação de ingresso para o evento
eventRoutes
  .route("/:event_id/tickets")
  .all(policies.isAllowed)
  .post((request: Request, response: Response) => {
    return createTicketController.handle(request, response);
  });

// buscar evento pelo slug
eventRoutes
  .route("/api/events/slug")
  .get((request: RequestWithAuth, response: Response) => {
    return findEventController.handle(request, response);
  });
