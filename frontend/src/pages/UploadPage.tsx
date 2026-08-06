import { useState } from 'react';
import { DropZone } from '../components/DropZone';
import FilePreview from '../components/FilePreview';
import StatusIndicator from '../components/StatusIndicator';
import { ResultsView } from '../components/ResultsView';
import { useUploadDocument } from '../hooks/useUploadDocument';
import { extractErrorMessage } from '../api/errorHandler';
import type { UploadStatus } from '../types/document';

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const mutation = useUploadDocument();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setValidationError(null);
    mutation.reset();
  };

  const handleValidationError = (message: string) => {
    setValidationError(message);
    setSelectedFile(null);
    mutation.reset();
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setValidationError(null);
    mutation.mutate(selectedFile);
  };

  // Derive the upload status for StatusIndicator
  let status: UploadStatus = 'idle';
  let statusMessage: string | undefined;

  if (validationError) {
    status = 'error';
    statusMessage = validationError;
  } else if (mutation.isPending) {
    status = 'uploading';
  } else if (mutation.isSuccess) {
    status = 'success';
  } else if (mutation.isError) {
    status = 'error';
    statusMessage = extractErrorMessage(mutation.error);
  }

  const isUploading = mutation.isPending;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
          Upload Document
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Upload a document to extract structured data using AI.
        </p>
      </div>

      {/* DropZone — full width on all screens */}
      <DropZone
        onFileSelect={handleFileSelect}
        onValidationError={handleValidationError}
        disabled={isUploading}
      />

      {selectedFile && (
        <div className="space-y-3 sm:space-y-4">
          <FilePreview file={selectedFile} />
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isUploading ? 'Uploading...' : mutation.isError ? 'Retry Upload' : 'Upload'}
          </button>
        </div>
      )}

      <StatusIndicator status={status} message={statusMessage} />

      {mutation.isSuccess && mutation.data && (
        <div className="mt-4 sm:mt-6">
          <ResultsView result={mutation.data} />
        </div>
      )}
    </div>
  );
}
