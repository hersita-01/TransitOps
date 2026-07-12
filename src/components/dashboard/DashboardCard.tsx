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
        'rounded-2xl border border-slate-700/50 bg-slate-800/35 flex flex-col card-lift',
        'backdrop-filter backdrop-blur-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/40">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && (
          <Link
            to={action.href}
            className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 group"
          >
            {action.label}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </section>
  );
}
