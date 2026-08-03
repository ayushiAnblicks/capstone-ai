import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

async function main(): Promise<void> {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.join(scriptDir, "..", "sql", "schema.sql");
  const sql = readFileSync(schemaPath, "utf8");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log("schema.sql applied successfully (tables created/verified, definitions seeded).");
  } finally {
    await connection.end();
  }
}

main().catch((err: unknown) => {
  console.error("Failed to apply sql/schema.sql:");
  console.error(err);
  process.exitCode = 1;
});
