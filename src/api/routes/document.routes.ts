import { Router } from "express";

import multer from "multer";

import { processDocumentController } from "../controllers/document.controller";

const router = Router();

const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post(
  "/process",

  upload.single("file"),

  processDocumentController,
);

export default router;
