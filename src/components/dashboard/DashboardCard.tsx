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
      className={cn('rounded-2xl flex flex-col card-lift', className)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-base)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b shrink-0"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <h2
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <Link
            to={action.href}
            className="flex items-center gap-1 text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors shrink-0 group"
          >
            {action.label}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}
