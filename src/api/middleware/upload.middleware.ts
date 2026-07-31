import multer from "multer";
import { ApiError } from "../../utils/apiError.js";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

/** Multer middleware for a single `file` field, memory storage only. */
export const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
      return;
    }
    callback(null, true);
  },
}).single("file");
