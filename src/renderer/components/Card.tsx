import React from 'react';

type CardVariant = 'content' | 'stat' | 'info' | 'action';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  content: 'rounded-card border border-neutral-200 bg-white p-4 shadow-subtle',
  stat: 'rounded-card border border-neutral-200 bg-white p-4 shadow-subtle',
  info: 'rounded-card border border-primary-100 bg-primary-50 p-4',
  action:
    'rounded-card border border-neutral-200 bg-white p-4 shadow-subtle hover:shadow-medium transition-shadow cursor-pointer',
};

export function Card({
  children,
  variant = 'content',
  className = '',
}: CardProps): React.ReactElement {
  return (
    <div className={[variantClasses[variant], className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
