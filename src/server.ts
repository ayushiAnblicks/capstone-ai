import express from "express";

import { config } from "./config/env";

import documentRoutes from "./api/routes/document.routes";

import { initializeDatabase } from "./database/init-db";

const app = express();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ========================================
// HEALTH CHECK
// ========================================

app.get(
  "/health",

  (_req, res) => {
    res.json({
      success: true,

      message: "AI Document Extraction API is running",
    });
  },
);

// ========================================
// DOCUMENT ROUTES
// ========================================

app.use(
  "/api/documents",

  documentRoutes,
);

// ========================================
// START SERVER
// ========================================

async function startServer() {
  try {
    console.log("Initializing database...");

    await initializeDatabase();

    app.listen(
      config.port,

      () => {
        console.log(`Server running on http://localhost:${config.port}`);
      },
    );
  } catch (error) {
    console.error(
      "Failed to start application:",

      error,
    );

    process.exit(1);
  }
}

startServer();
