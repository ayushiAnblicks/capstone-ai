import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getDocuments } from '../api/documents';

export function useDocuments(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['documents', page, limit],
    queryFn: () => getDocuments(page, limit),
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
  });
}
