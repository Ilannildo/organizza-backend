import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport from "passport";

import { routes } from "./routes/index";
import { authSessionMiddleware } from "./utils/middlewares/authSession";
import { handleJWTAuthentication } from "./usecases/users/utils/strategies/authenticate";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
/// Add Json middleware
app.use(express.json());

app.use((request: Request, response: Response, next: NextFunction) =>
  authSessionMiddleware(request, response, next)
);
// Add passport's middleware
app.use(passport.initialize());
require("./usecases/users/utils/strategies/jwt")(passport);
// Add user authentication JWT middleware
app.use((request: Request, response: Response, next: NextFunction) =>
  handleJWTAuthentication(request, response, next)
);

// Add routes
app.use(routes);

export { app };
