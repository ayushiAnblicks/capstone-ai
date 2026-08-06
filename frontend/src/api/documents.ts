import apiClient from './client';
import type { DocumentResult, PaginatedResponse } from '../types/document';

export async function uploadDocument(file: File): Promise<DocumentResult> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<{ data: DocumentResult }>('/documents', formData);
  return response.data.data;
}

export async function getDocuments(page: number = 1, limit: number = 20): Promise<PaginatedResponse<DocumentResult>> {
  const response = await apiClient.get<PaginatedResponse<DocumentResult>>('/documents', {
    params: { page, limit },
  });
  return response.data;
}

export async function getDocumentById(id: number): Promise<DocumentResult> {
  const response = await apiClient.get<{ data: DocumentResult }>(`/documents/${id}`);
  return response.data.data;
}
