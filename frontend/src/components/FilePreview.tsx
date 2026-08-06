/**
 * Formats a file size in bytes into a human-readable string.
 * - bytes < 1024 → "X B"
 * - bytes < 1MB (1048576) → "X.X KB"
 * - bytes >= 1MB → "X.X MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FilePreviewProps {
  file: File;
}

export default function FilePreview({ file }: FilePreviewProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-2xl" aria-hidden="true">
        📄
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}
