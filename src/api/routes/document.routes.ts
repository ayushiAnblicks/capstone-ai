import { Router } from "express";
import { uploadDocumentHandler } from "../controllers/document.controller.js";
import { uploadDocument } from "../middleware/upload.middleware.js";

export const documentRouter = Router();

documentRouter.post("/", uploadDocument, uploadDocumentHandler);
