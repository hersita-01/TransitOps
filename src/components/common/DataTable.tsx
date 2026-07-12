import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Settings2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils';
import { EmptyState } from './EmptyState';
import { usePreferences } from '@/context/PreferencesContext';
import type { SortState } from '@/types';

// ── Column definition ────────────────────────────────────────

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// ── Props ────────────────────────────────────────────────────

interface DataTableProps<T> {
  id?: string;
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onSort?: (sort: SortState) => void;
  sort?: SortState;
  className?: string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  showToolbar?: boolean;
}

// ── Sort Icon ────────────────────────────────────────────────

function SortIcon({ column, sort }: { column: string; sort?: SortState }): React.JSX.Element {
  if (!sort || sort.column !== column) {
    return <ArrowUpDown className="w-3.5 h-3.5 ml-1 inline opacity-40" />;
  }
  return sort.direction === 'asc'
    ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400 ml-1 inline" />
    : <ArrowDown className="w-3.5 h-3.5 text-cyan-400 ml-1 inline" />;
}

// ── Loading skeleton ─────────────────────────────────────────

function SkeletonRows({ cols }: { cols: number }): React.JSX.Element {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-700/30">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-4 py-3.5">
              <div
                className="h-3.5 rounded-md shimmer"
                style={{ width: `${55 + (j * 13 + i * 7) % 40}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Main Component ───────────────────────────────────────────

export function DataTable<T>({
  id = 'data-table',
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  onSort,
  sort,
  className,
  rowClassName,
  onRowClick,
  showToolbar = true,
}: DataTableProps<T>): React.JSX.Element {
  const [internalSort, setInternalSort] = useState<SortState | undefined>(sort);
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(new Set());
  const { tableDensity, setTableDensity } = usePreferences();
  const [showColSettings, setShowColSettings] = useState(false);

  function handleSort(key: string): void {
    const newSort: SortState = {
      column: key,
      direction: internalSort?.column === key && internalSort.direction === 'asc' ? 'desc' : 'asc',
    };
    setInternalSort(newSort);
    onSort?.(newSort);
  }

  const activeSort = sort ?? internalSort;
  const visibleColumns = columns.filter((col) => !hiddenCols.has(col.key));
  const cellPadding = tableDensity === 'compact' ? 'px-3 py-1.5' : 'px-4 py-3';

  const toggleCol = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div id={id} className={cn('flex flex-col gap-3', className)}>
      {showToolbar && (
        <div className="flex items-center justify-end gap-3 print:hidden relative">
          {/* Density selector */}
          <div
            className="flex items-center gap-1 p-1 rounded-lg border"
            style={{ background: 'var(--surface-card)', borderColor: 'var(--border-base)' }}
          >
            {(['comfortable', 'compact'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setTableDensity(d)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 capitalize',
                  tableDensity === d
                    ? 'text-white'
                    : 'transition-colors'
                )}
                style={tableDensity === d ? {
                  background: 'var(--surface-overlay)',
                  color: 'var(--text-primary)',
                } : { color: 'var(--text-muted)' }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Column visibility */}
          <div className="relative">
            <button
              onClick={() => setShowColSettings(!showColSettings)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all duration-150 btn-base"
              style={{
                background: 'var(--surface-card)',
                borderColor: 'var(--border-base)',
                color: 'var(--text-secondary)',
              }}
            >
              <Settings2 className="w-3.5 h-3.5" />
              Columns
            </button>
            {showColSettings && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl z-50 py-2 border"
                style={{
                  background: 'var(--surface-overlay)',
                  borderColor: 'var(--border-base)',
                  boxShadow: 'var(--shadow-modal)',
                }}
              >
                {columns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => toggleCol(col.key)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    <span>{col.header}</span>
                    {hiddenCols.has(col.key)
                      ? <EyeOff className="w-3.5 h-3.5" style={{ color: 'var(--text-disabled)' }} />
                      : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: 'var(--border-base)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-sm relative" style={{ background: 'var(--surface-card)' }}>
            {/* Head */}
            <thead className="sticky top-0 z-20">
              <tr
                className="border-b"
                style={{ background: 'var(--surface-elevated)', borderColor: 'var(--border-base)' }}
              >
                {visibleColumns.map((col, idx) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    cellPadding,
                    'text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none transition-colors',
                    idx === 0 && 'sticky left-0 z-30 border-r'
                  )}
                  style={{
                    color: 'var(--text-muted)',
                    background: 'var(--surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    ...(col.width ? { width: col.width } : {})
                  }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    activeSort?.column === col.key
                      ? activeSort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {col.header}
                  {col.sortable && <SortIcon column={col.key} sort={activeSort} />}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <SkeletonRows cols={visibleColumns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'group transition-all duration-100',
                    onRowClick ? 'cursor-pointer' : '',
                    rowClassName?.(row)
                  )}
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => { if (onRowClick) (e.currentTarget as HTMLElement).style.background = 'var(--interactive-primary-dim)'; else (e.currentTarget as HTMLElement).style.background = 'var(--surface-elevated)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                >
                  {visibleColumns.map((col, idx) => (
                    <td
                      key={col.key}
                      className={cn(
                        cellPadding,
                        'whitespace-nowrap transition-colors duration-100',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        idx === 0 && 'sticky left-0 z-10 border-r backdrop-blur-sm'
                      )}
                      style={{
                        color: 'var(--text-secondary)',
                        ...(idx === 0 ? {
                          borderColor: 'var(--border-subtle)',
                          background: 'var(--surface-card)',
                        } : {})
                      }}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
