import { Router } from "express";
import { uploadDocumentHandler, getDocumentsHandler, getDocumentByIdHandler } from "../controllers/document.controller.js";
import { uploadDocument } from "../middleware/upload.middleware.js";

export const documentRouter = Router();

documentRouter.get("/", getDocumentsHandler);
documentRouter.get("/:id", getDocumentByIdHandler);
documentRouter.post("/", uploadDocument, uploadDocumentHandler);
