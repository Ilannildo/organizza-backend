import { Request, Response, Router } from "express";
import { getAllMainSubjectController } from "../usecases/main-subjects/get-all";

export const mainSubjectRoutes = Router();

// todos os assuntos principais
mainSubjectRoutes.route("").get((request: Request, response: Response) => {
  return getAllMainSubjectController.handle(request, response);
});
