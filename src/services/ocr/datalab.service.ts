import { config } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";

const DATALAB_BASE_URL = "https://www.datalab.to/api/v1";
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30;

export interface OcrInput {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
}

interface MarkerSubmitResponse {
  request_id?: string;
  success?: boolean;
  error?: string;
}

interface MarkerPollResponse {
  status?: string; // "processing" | "complete" | "failed"
  markdown?: string;
  success?: boolean;
  error?: string;
}

/** Submits a document to Datalab's /marker endpoint and polls until OCR text is ready. */
export async function extractText(input: OcrInput): Promise<string> {
  const requestId = await submitDocument(input);
  return pollForResult(requestId);
}

async function submitDocument(input: OcrInput): Promise<string> {
  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(input.buffer)], { type: input.mimeType }), input.fileName);
  formData.append("output_format", "markdown");

  const response = await fetch(`${DATALAB_BASE_URL}/marker`, {
    method: "POST",
    headers: { "X-Api-Key": config.datalabApiKey },
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(502, `Datalab OCR submission failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as MarkerSubmitResponse;
  if (!payload.request_id) {
    throw new ApiError(502, payload.error ?? "Datalab OCR submission did not return a request_id");
  }
  return payload.request_id;
}

async function pollForResult(requestId: string): Promise<string> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const response = await fetch(`${DATALAB_BASE_URL}/marker/${requestId}`, {
      method: "GET",
      headers: { "X-Api-Key": config.datalabApiKey },
    });

    if (!response.ok) {
      throw new ApiError(502, `Datalab OCR status check failed: ${response.status} ${response.statusText}`);
    }

    const payload = (await response.json()) as MarkerPollResponse;

    if (payload.status === "complete") {
      if (!payload.markdown) {
        throw new ApiError(502, "Datalab OCR completed without returning markdown text");
      }
      return payload.markdown;
    }

    if (payload.status === "failed") {
      throw new ApiError(502, `Datalab OCR processing failed: ${payload.error ?? "unknown error"}`);
    }
  }

  throw new ApiError(504, "Datalab OCR processing timed out");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
