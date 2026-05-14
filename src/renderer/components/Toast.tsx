import React from 'react';

type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
  className?: string;
}

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-neutral-800 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-error text-white',
};

export function Toast({
  message,
  variant = 'default',
  onDismiss,
  className = '',
}: ToastProps): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={[
        'flex items-center justify-between gap-3 rounded-card px-4 py-3 text-sm shadow-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
