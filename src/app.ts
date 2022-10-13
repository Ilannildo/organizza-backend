import express from "express";
import cors from "cors";

import { routes } from "./routes/index";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

export { app };
