import { useCallback, useRef, useState } from 'react';
import { FILE_CONSTRAINTS } from '../types/document';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onValidationError: (message: string) => void;
  acceptedTypes?: readonly string[];
  maxSize?: number;
  disabled?: boolean;
}

export function DropZone({
  onFileSelect,
  onValidationError,
  acceptedTypes = FILE_CONSTRAINTS.acceptedMimeTypes,
  maxSize = FILE_CONSTRAINTS.maxSizeBytes,
  disabled = false,
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        const maxMB = Math.round(maxSize / (1024 * 1024));
        onValidationError(
          `File size exceeds the maximum allowed size of ${maxMB} MB.`
        );
        return;
      }

      if (!acceptedTypes.includes(file.type)) {
        onValidationError(
          `Unsupported file type. Accepted formats: ${acceptedTypes.join(', ')}`
        );
        return;
      }

      onFileSelect(file);
    },
    [maxSize, acceptedTypes, onFileSelect, onValidationError]
  );

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
  };

  const baseClasses =
    'border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors min-h-[120px] flex flex-col items-center justify-center';
  const stateClasses = disabled
    ? 'border-gray-300 opacity-50 cursor-not-allowed'
    : isDragActive
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-300 hover:border-gray-400';

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="File upload drop zone"
      aria-disabled={disabled}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={FILE_CONSTRAINTS.acceptedExtensions}
        onChange={handleInputChange}
        disabled={disabled}
        aria-hidden="true"
      />
      <p className="text-sm sm:text-base text-gray-600 mb-2">
        Drag and drop a file here, or click to browse
      </p>
      <p className="text-xs sm:text-sm text-gray-400">
        Accepted formats: PDF, PNG, JPG, JPEG, TIFF (max 10 MB)
      </p>
    </div>
  );
}
