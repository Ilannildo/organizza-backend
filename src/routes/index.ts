import { Request, Response, Router } from "express";

export const routes = Router();

routes.route("/").get((request: Request, response: Response) => {
  return response.status(200).json({
    message: "Hello World",
  });
});
