import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const config = {
  port: Number(process.env.PORT || 3000),

  openai: {
    apiKey: requiredEnv("OPENAI_API_KEY"),

    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  },

  datalab: {
    apiKey: requiredEnv("DATALAB_API_KEY"),

    apiUrl: requiredEnv("DATALAB_API_URL"),
  },

  database: {
    host: requiredEnv("DB_HOST"),

    port: Number(process.env.DB_PORT || 3306),

    user: requiredEnv("DB_USER"),

    password: requiredEnv("DB_PASSWORD"),

    database: requiredEnv("DB_NAME"),
  },
};
