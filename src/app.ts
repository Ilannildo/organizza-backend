import express, { NextFunction, Request, Response } from "express";
import { createWriteStream } from "fs";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import { authSessionMiddleware } from "./utils/middlewares/auth-session";
import { handleJWTAuthentication } from "./utils/strategies/authenticate";
import { mainSubjectRoutes } from "./routes/main-subject.routes";
import { eventTypesRoutes } from "./routes/event-type.routes";
import { stateRoutes } from "./routes/state.routes";
import { eventRoutes } from "./routes/event.routes";
import { cityRoutes } from "./routes/city.routes";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";

import * as policies from "./utils/policies/v1/users.policy";
import { eventPageRoutes } from "./routes/event-page.routes";
import { sessionTypesRoutes } from "./routes/session-type.routes";
import { serviceOrderRoutes } from "./routes/service-order.routes";
import { eventPanelRoutes } from "./routes/event-panel.routes";

// configurando o .env em ambiente de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// instanciando o express
const app = express();

// adicionando o middleware de cors
app.use(cors());

// adicionando o middleware de urlencoded
app.use(express.urlencoded({ extended: true }));

/// adicionando o middleware de json
app.use(express.json());

// adicionando o middleware de autenticação
app.use((request: Request, response: Response, next: NextFunction) =>
  authSessionMiddleware(request, response, next)
);
// adicionando o middleware de passport jwt
app.use(passport.initialize());
require("./utils/strategies/jwt")(passport);

// adicionando o middleware de autenticação do usuário com passport
app.use((request: Request, response: Response, next: NextFunction) =>
  handleJWTAuthentication(request, response, next)
);

// criando a pasta de uploads para arquivos
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

// criando a pasta e arquivo para logs de https
const accessLogStream = createWriteStream(
  path.join(__dirname, "..", "logs", "access.log"),
  {
    flags: "a",
  }
);

// adicionando o middleware de morgan
app.use(morgan("dev"));
app.use(
  morgan("common", {
    stream: accessLogStream,
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

policies.invokeRolesPolicies();

// adicionando rotas de autenticação
app.use("/api/auth", authRoutes);

// adicionando as rotas de usuário
app.use("/api/users", userRoutes);

// adicionando as rotas de cidades
app.use("/api/cities", cityRoutes);

// adicionando as rotas de estados
app.use("/api/states", stateRoutes);

// adicionando as rotas de eventos
app.use("/api/events", eventRoutes);

// adicionando as rotas de tipos de eventos
app.use("/api/event-types", eventTypesRoutes);

// adicionando as rotas de assunto principal
app.use("/api/main-subjects", mainSubjectRoutes);

// adicionando as rotas de pagina de eventos (público)
app.use("/api/event-page", eventPageRoutes);

// adicionando as rotas de pagina de eventos (público)
app.use("/api/session-types", sessionTypesRoutes);

// adicionando as rotas de pagina de eventos (público)
app.use("/api/service-orders", serviceOrderRoutes);

// adicionando as rotas de painel do evento
app.use("/api/event-panel", eventPanelRoutes);

export { app };
