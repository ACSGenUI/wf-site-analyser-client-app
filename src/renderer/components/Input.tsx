import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  disabled,
  id,
  className = '',
  ...props
}: InputProps): React.ReactElement {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        className={[
          'w-full rounded border px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          hasError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500',
          disabled ? 'cursor-not-allowed opacity-50 bg-gray-50' : 'bg-white',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        disabled={disabled}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
      {hasError && (
        <p
          id={inputId ? `${inputId}-error` : undefined}
          className="text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
