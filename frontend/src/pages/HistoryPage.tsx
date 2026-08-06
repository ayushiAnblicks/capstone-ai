import { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { ErrorNotification } from '../components/ErrorNotification';
import { Pagination } from '../components/Pagination';
import { ResultsView } from '../components/ResultsView';
import { extractErrorMessage } from '../api/errorHandler';
import type { DocumentResult } from '../types/document';

function formatDocumentType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString();
}

export function HistoryPage() {
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<DocumentResult | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);

  const { data, isLoading, isError, error, refetch } = useDocuments(page);

  const handleDismissError = () => {
    setErrorDismissed(true);
  };

  const handleRetry = () => {
    setErrorDismissed(false);
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedItem(null);
  };

  const handleSelectItem = (item: DocumentResult) => {
    setSelectedItem(item);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // Show selected item detail view
  if (selectedItem) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <button
          type="button"
          onClick={handleBackToList}
          className="min-h-[44px] text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          ← Back to History
        </button>
        <ResultsView result={selectedItem} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          Processing History
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Browse previously processed documents.
        </p>
      </div>

      {isError && !errorDismissed && (
        <ErrorNotification
          message={extractErrorMessage(error)}
          onDismiss={handleDismissError}
          onRetry={handleRetry}
        />
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Loading documents...</span>
          </div>
        </div>
      )}

      {data && data.data.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          No documents have been processed yet.
        </p>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {data.data.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(item)}
                className="w-full text-left px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-h-[44px]"
              >
                <span className="inline-block self-start px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 shrink-0">
                  {formatDocumentType(item.documentType)}
                </span>
                <span className="flex-1 font-medium text-gray-900 truncate text-sm sm:text-base">
                  {item.fileName}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap shrink-0">
                  {formatDate(item.createdAt)}
                </span>
              </button>
            ))}
          </div>

          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
