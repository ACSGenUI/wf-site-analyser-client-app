import React from 'react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'left' | 'right';
  className?: string;
}

export function Drawer({
  open,
  onClose,
  children,
  title,
  side = 'right',
  className = '',
}: DrawerProps): React.ReactElement {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          aria-hidden="true"
          onClick={onClose}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Drawer'}
        className={[
          'fixed top-0 bottom-0 z-50 flex w-80 flex-col bg-white shadow-xl transition-transform duration-300',
          side === 'right' ? 'right-0' : 'left-0',
          open
            ? 'translate-x-0'
            : side === 'right'
              ? 'translate-x-full'
              : '-translate-x-full',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
