import mysql from "mysql2/promise";

import { config } from "../config/env";

export async function initializeDatabase(): Promise<void> {
  console.log("Connecting to MySQL server...");

  // ----------------------------------------
  // 1. Connect to MySQL Server
  // ----------------------------------------

  const connection = await mysql.createConnection({
    host: config.database.host,

    port: config.database.port,

    user: config.database.user,

    password: config.database.password,
  });

  try {
    console.log("Connected to MySQL server");

    // ----------------------------------------
    // 2. Create Database
    // ----------------------------------------

    await connection.query(`
      CREATE DATABASE IF NOT EXISTS
      \`${config.database.database}\`

      CHARACTER SET utf8mb4

      COLLATE utf8mb4_unicode_ci
    `);

    console.log(`Database "${config.database.database}" is ready`);
  } finally {
    await connection.end();
  }

  // ----------------------------------------
  // 3. Connect to Application Database
  // ----------------------------------------

  const dbConnection = await mysql.createConnection({
    host: config.database.host,

    port: config.database.port,

    user: config.database.user,

    password: config.database.password,

    database: config.database.database,
  });

  try {
    // ----------------------------------------
    // 4. Create document_result Table
    // ----------------------------------------

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS
      document_result (

        id BIGINT UNSIGNED
        NOT NULL AUTO_INCREMENT,

        document_type
        VARCHAR(100)
        NOT NULL,

        file_name
        VARCHAR(255)
        NOT NULL,

        extracted_json
        JSON
        NOT NULL,

        created_at
        DATETIME
        NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        INDEX idx_document_type
        (document_type),

        INDEX idx_created_at
        (created_at)

      )
    `);

    console.log('Table "document_result" is ready');
  } finally {
    await dbConnection.end();
  }

  console.log("Database initialization completed successfully");
}
