import multer from "multer";
import { Request, Response, Router } from "express";
import { uploadEventCoverController } from "../usecases/events/upload_cover";
import { registerUserController } from "../usecases/users/register";
import { authUserController } from "../usecases/users/auth";
import { meUserController } from "../usecases/users/me";
import { RequestWithAuth } from "../utils/types";
import { multerConfigs } from "../config/multer";

import * as policies from "../utils/policies/v1/users.policy";
import * as usersValidations from "../validations/users.validation";
import * as eventsValidations from "../validations/events.validation";
import { createEventController } from "../usecases/events/create";
import { listAllCitiesController } from "../usecases/cities/list_all";
import { listAllStatesController } from "../usecases/states/list_all";
import { listAllEventTypesController } from "../usecases/event_types/list_all";
import { listAllMainSubjectController } from "../usecases/main_subjects/list_all";
import { findEventController } from "../usecases/events/find";

export const routes = Router();

policies.invokeRolesPolicies();

// efetua o login do usuário
routes
  .route("/api/auth/login")
  .post(usersValidations.login, (request: Request, response: Response) => {
    return authUserController.handle(request, response);
  });

// efetua o cadastro do usuário
routes
  .route("/api/auth/register")
  .post(usersValidations.register, (request: Request, response: Response) => {
    return registerUserController.handle(request, response);
  });

// busca os dados do usuário logado
routes
  .route("/api/me")
  .all(policies.isAllowed)
  .get((request: RequestWithAuth, response: Response) => {
    return meUserController.handle(request, response);
  });

// cadastro de eventos
routes
  .route("/api/events")
  .all(policies.isAllowed)
  .post(
    eventsValidations.register,
    (request: RequestWithAuth, response: Response) => {
      return createEventController.handle(request, response);
    }
  );

// efetua o upload da capa do evento
routes
  .route("/api/events/cover")
  .all(policies.isAllowed, multer(multerConfigs).single("cover"))
  .post(
    eventsValidations.upload_cover,
    (request: RequestWithAuth, response: Response) => {
      return uploadEventCoverController.handle(request, response);
    }
  );

// todas as cidades
routes.route("/api/cities").get((request: Request, response: Response) => {
  return listAllCitiesController.handle(request, response);
});

// todos os estados
routes.route("/api/states").get((request: Request, response: Response) => {
  return listAllStatesController.handle(request, response);
});

// todos os tipos de eventos
routes.route("/api/event-types").get((request: Request, response: Response) => {
  return listAllEventTypesController.handle(request, response);
});

// todos os assuntos principais
routes
  .route("/api/main-subjects")
  .get((request: Request, response: Response) => {
    return listAllMainSubjectController.handle(request, response);
  });

// PUBLIC ROUTES --------------------------------

// buscar evento pelo slug
routes
  .route("/api/events/slug")
  .get((request: RequestWithAuth, response: Response) => {
    return findEventController.handle(request, response);
  });
