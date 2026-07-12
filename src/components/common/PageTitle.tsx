import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  className?: string;
}

export function PageTitle({
  title,
  subtitle,
  breadcrumb,
  actions,
  className,
}: PageTitleProps): React.JSX.Element {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-8', className)}>
      <div>
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-disabled)' }}>
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3 opacity-50" />}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="transition-colors hover:text-slate-300"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span style={{ color: i === breadcrumb.length - 1 ? 'var(--text-muted)' : 'var(--text-disabled)' }}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Heading */}
        <h1
          className="text-2xl font-bold tracking-tight leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Action slot */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 pt-0.5">{actions}</div>
      )}
    </div>
  );
}
