import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils';
import type { DashboardCardProps } from '@/types/dashboard';

export function DashboardCard({
  title,
  subtitle,
  action,
  children,
  className,
}: DashboardCardProps): React.JSX.Element {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-700/60 bg-slate-800/40 flex flex-col hover-card-up',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
        <div>
          <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action && (
          <Link
            to={action.href}
            className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors shrink-0"
          >
            {action.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </section>
  );
}
