import express from "express";
import { apiRouter } from "./api/routes/index.js";
import { errorHandlerMiddleware } from "./api/middleware/errorHandler.middleware.js";
import { config } from "./config/env.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use(errorHandlerMiddleware);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
