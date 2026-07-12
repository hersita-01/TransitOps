import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps): React.JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ background: 'rgba(2, 8, 23, 0.80)' }}
        />
        {/* Panel */}
        <Dialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%]',
            'rounded-2xl border p-6',
            'duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            className
          )}
          style={{
            background: 'var(--surface-elevated)',
            borderColor: 'var(--border-base)',
            boxShadow: 'var(--shadow-modal)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col space-y-1.5 mb-4">
            <Dialog.Title
              className="text-base font-semibold leading-none tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                {description}
              </Dialog.Description>
            )}
          </div>

          {/* Body */}
          <div className="relative">{children}</div>

          {/* Close button */}
          <Dialog.Close
            className="absolute right-4 top-4 rounded-lg p-1.5 transition-all duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-overlay)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
