import OpenAI from "openai";
import { config } from "./env.js";

export const openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
