interface ErrorNotificationProps {
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export function ErrorNotification({
  message,
  onDismiss,
  onRetry,
}: ErrorNotificationProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-center justify-between gap-3 p-4 rounded-lg bg-red-50 border border-red-200"
    >
      <p className="text-red-800 text-sm flex-1">{message}</p>

      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm font-medium text-red-700 hover:text-red-900 underline"
          >
            Retry
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-red-400 hover:text-red-600"
          aria-label="Dismiss error"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
