/** Mirrors the backend DocumentResultRecord */
export interface DocumentResult {
  id: number;
  documentType: DocumentType;
  fileName: string;
  extractedJson: Record<string, unknown>;
  createdAt: string;
}

export type DocumentType =
  | 'invoice'
  | 'purchase_order'
  | 'utility_bill'
  | 'bank_statement'
  | 'driver_license';

/** File validation constraints (client-side mirror of backend rules) */
export const FILE_CONSTRAINTS = {
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  acceptedMimeTypes: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/tiff',
  ] as const,
  acceptedExtensions: '.pdf,.png,.jpg,.jpeg,.tiff',
} as const;

/** Upload lifecycle states */
export type UploadStatus = 'idle' | 'validating' | 'uploading' | 'processing' | 'success' | 'error';

/** Error response shape from the backend API */
export interface ApiErrorResponse {
  error: {
    message: string;
    details?: unknown;
  };
}

/** Paginated response wrapper from the backend */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
