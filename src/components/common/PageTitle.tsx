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
            <ol className="flex items-center gap-1 text-xs text-slate-600">
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-slate-700" />}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-slate-400 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-slate-500">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Heading */}
        <h1 className="text-2xl font-bold text-slate-50 tracking-tight leading-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Action slot */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0 pt-0.5">{actions}</div>
      )}
    </div>
  );
}
