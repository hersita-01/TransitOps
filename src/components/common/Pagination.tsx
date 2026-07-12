import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils';
import type { PaginationState } from '@/types';

interface PaginationProps extends PaginationState {
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps): React.JSX.Element | null {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const pages = buildPageNumbers(page, totalPages);

  return (
    <div
      className={cn('flex items-center justify-between gap-4 mt-4', className)}
      aria-label="Pagination"
    >
      {/* Count */}
      <span className="text-xs text-slate-400 shrink-0">
        Showing <span className="text-slate-200 font-medium">{start}–{end}</span> of{' '}
        <span className="text-slate-200 font-medium">{total}</span>
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </PageButton>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-500 text-sm">…</span>
          ) : (
            <PageButton
              key={p}
              onClick={() => onPageChange(p as number)}
              active={p === page}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </PageButton>
      </div>
    </div>
  );
}

// ── Internal helpers ─────────────────────────────────────────

interface PageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function PageButton({ active, className, children, ...props }: PageButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        'min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-all duration-150',
        active
          ? 'text-white shadow-md shadow-cyan-600/20'
          : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300 border border-slate-800/80',
        props.disabled && 'opacity-30 cursor-not-allowed',
        className
      )}
      style={active ? { background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', border: '1px solid rgba(34,211,238,0.3)' } : undefined}
      {...props}
    >
      {children}
    </button>
  );
}

function buildPageNumbers(current: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}
