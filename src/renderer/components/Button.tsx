import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
  secondary:
    'border border-primary text-primary bg-transparent hover:bg-primary-50 focus:ring-primary-500',
  ghost:
    'text-primary bg-transparent hover:bg-primary-50 focus:ring-primary-500 border border-transparent',
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled === true || loading;

  return (
    <button
      type="button"
      className={[
        'inline-flex items-center justify-center gap-2 rounded-input px-4 py-2 text-sm font-medium',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
        variantClasses[variant],
        isDisabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span
          role="status"
          aria-label="Loading"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
