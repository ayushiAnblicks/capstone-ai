import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const config = {
  port: Number(process.env.PORT || 3000),

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  openaiApiKey: process.env.OPENAI_API_KEY!,
  datalabApiKey: process.env.DATALAB_API_KEY!,

  database: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
};
