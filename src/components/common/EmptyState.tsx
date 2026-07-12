import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters, or add a new record to get started.',
  action,
  icon,
  className,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-20 px-6 text-center',
        className
      )}
    >
      {/* Icon container */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-6">
        {/* Layered rings */}
        <div
          className="absolute inset-0 rounded-2xl opacity-60"
          style={{
            background: 'var(--interactive-primary-dim)',
            border: '1px solid var(--border-base)',
            boxShadow: '0 0 24px rgba(34,211,238,0.06) inset',
          }}
        />
        <div
          className="absolute inset-2 rounded-xl"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        />
        <div className="relative z-10 flex items-center justify-center w-10 h-10">
          <span style={{ color: 'var(--text-muted)' }}>
            {icon ?? <PackageOpen className="w-6 h-6" />}
          </span>
        </div>
      </div>

      <h3
        className="text-sm font-semibold mb-1.5 tracking-tight"
        style={{ color: 'var(--text-secondary)' }}
      >
        {title}
      </h3>
      <p
        className="text-xs max-w-xs leading-relaxed"
        style={{ color: 'var(--text-muted)' }}
      >
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
