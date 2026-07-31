import { Router } from "express";
import { documentRouter } from "./document.routes.js";

export const apiRouter = Router();

apiRouter.use("/documents", documentRouter);
