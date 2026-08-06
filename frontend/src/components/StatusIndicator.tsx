import type { UploadStatus } from '../types/document';

interface StatusIndicatorProps {
  status: UploadStatus;
  message?: string;
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function StatusIndicator({ status, message }: StatusIndicatorProps) {
  if (status === 'idle') {
    return null;
  }

  const config: Record<
    Exclude<UploadStatus, 'idle'>,
    { containerClass: string; icon: React.ReactNode; text: string }
  > = {
    validating: {
      containerClass: 'bg-blue-50 text-blue-700',
      icon: <Spinner />,
      text: 'Validating file...',
    },
    uploading: {
      containerClass: 'bg-blue-50 text-blue-700',
      icon: <Spinner />,
      text: 'Uploading document...',
    },
    processing: {
      containerClass: 'bg-blue-50 text-blue-700',
      icon: <Spinner />,
      text: 'Processing document... This may take a moment.',
    },
    success: {
      containerClass: 'bg-green-50 text-green-700',
      icon: <CheckIcon />,
      text: 'Document processed successfully!',
    },
    error: {
      containerClass: 'bg-red-50 text-red-700',
      icon: <ErrorIcon />,
      text: message || 'An error occurred',
    },
  };

  const { containerClass, icon, text } = config[status];

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-lg ${containerClass}`}
      role="status"
      aria-live="polite"
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}
