import { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/document';

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      const body = error.response.data as ApiErrorResponse;
      return body.error?.message || `Server error (${error.response.status})`;
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. The document may be taking longer than expected to process.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}
