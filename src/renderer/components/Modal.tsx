import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: ModalProps): React.ReactElement {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content
          className={[
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'w-full max-w-lg rounded-modal bg-white p-6 shadow-medium',
            'focus:outline-none',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-labelledby="modal-title"
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title id="modal-title" className="text-lg font-semibold text-neutral-900">
              {title}
            </Dialog.Title>
            <Dialog.Close
              onClick={onClose}
              className="rounded p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Close"
            >
              ✕
            </Dialog.Close>
          </div>
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
