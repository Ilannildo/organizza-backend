import { Request, Response, Router } from "express";
import { getAllCitiesController } from "../usecases/cities/get-all";

export const cityRoutes = Router();

// todas as cidades
cityRoutes.route("/").get((request: Request, response: Response) => {
  return getAllCitiesController.handle(request, response);
});
