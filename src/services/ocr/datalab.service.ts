import fs from "fs";

import axios from "axios";

import FormData from "form-data";

import { config } from "../../config/env";

import { OCRResult } from "../../types/document.types";

export async function extractText(filePath: string): Promise<OCRResult> {
  const formData = new FormData();

  formData.append(
    "file",

    fs.createReadStream(filePath),
  );

  try {
    /*
     * IMPORTANT:
     *
     * Replace this request with the exact
     * Datalab API request required by your
     * Datalab account/API version.
     */

    const response = await axios.post(
      config.datalab.apiUrl,

      formData,

      {
        headers: {
          ...formData.getHeaders(),

          Authorization: `Bearer ${config.datalab.apiKey}`,
        },
      },
    );

    return {
      text: response.data.text || response.data.markdown || "",

      metadata: response.data.metadata || {},
    };
  } catch (error) {
    console.error("Datalab OCR Error:", error);

    throw new Error("Failed to extract text using Datalab OCR");
  }
}
