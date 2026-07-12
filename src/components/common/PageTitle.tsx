import React from 'react';
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
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500">
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-600">/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-slate-300 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-slate-400">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Heading */}
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        )}
      </div>

      {/* Action slot */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
