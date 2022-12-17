import { Request, Response, Router } from "express";
import { getAllStatesController } from "../usecases/states/get-all";

export const stateRoutes = Router();

// todos os estados
stateRoutes.route("/").get((request: Request, response: Response) => {
  return getAllStatesController.handle(request, response);
});
