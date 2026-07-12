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
  title = 'No data found',
  description = 'There is nothing to display here yet.',
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
      <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl mb-6">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/40 shadow-inner" />
        <div className="relative z-10 w-11 h-11 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shadow-md">
          {icon ?? <PackageOpen className="w-5 h-5 text-slate-500" />}
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-300 mb-1.5 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
