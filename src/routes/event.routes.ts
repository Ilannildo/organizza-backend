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
import { getAllTicketByEventIdController } from "../usecases/tickets/get-all-by-event-id";
import { eventGeneralInformation } from "../usecases/events/general-information";
import { getAllSessionBySessionTypeController } from "../usecases/sessions/get-all-session-by-session-type";
import { createSessionController } from "../usecases/sessions/create-session";
import { getEventByUserIdInformationsController } from "../usecases/events/get-events-by-user-id-informations";

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
  .route("/:event_id/cover")
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
  .post((request: Request<{ event_id: string }>, response: Response) => {
    return createTicketController.handle(request, response);
  });

// busca todos os ingressos pelo id do evento
eventRoutes
  .route("/:event_id/tickets")
  .all(policies.isAllowed)
  .get((request: Request<{ event_id: string }>, response: Response) => {
    return getAllTicketByEventIdController.handle(request, response);
  });

// busca as informações gerais para exebir no painel
eventRoutes
  .route("/general-informations")
  // .all(policies.isAllowed)
  .get((request: RequestWithAuth, response: Response) => {
    return getEventByUserIdInformationsController.handle(request, response);
  });

// buscar evento pelo slug
eventRoutes
  .route("/slug")
  .get((request: RequestWithAuth, response: Response) => {
    return findEventController.handle(request, response);
  });

// buscar evento pelo slug
eventRoutes
  .route("/:event_id/session-types/:session_type_id/sessions")
  .get(
    (
      request: Request<{ event_id: string; session_type_id: string }>,
      response: Response
    ) => {
      return getAllSessionBySessionTypeController.handle(request, response);
    }
  );

// efetua a criação de ingresso para o evento
eventRoutes
  .route("/:event_id/sessions")
  .all(policies.isAllowed)
  .post(
    eventsValidations.createSession,
    (request: Request<{ event_id: string }>, response: Response) => {
      return createSessionController.handle(request, response);
    }
  );
