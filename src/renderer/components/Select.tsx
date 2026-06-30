import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  id?: string;
  error?: string;
  className?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled,
  label,
  id,
  error,
  className = '',
}: SelectProps): React.ReactElement {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hasError = Boolean(error);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    onChange?.(e.target.value);
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={hasError ? 'true' : undefined}
        className={[
          'w-full rounded border px-3 py-2 text-sm bg-white',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
          disabled ? 'cursor-not-allowed opacity-50 bg-gray-50' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
