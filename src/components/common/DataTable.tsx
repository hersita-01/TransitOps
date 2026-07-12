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
    return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 ml-1 inline" />;
  }
  return sort.direction === 'asc'
    ? <ArrowUp className="w-3.5 h-3.5 text-blue-400 ml-1 inline" />
    : <ArrowDown className="w-3.5 h-3.5 text-blue-400 ml-1 inline" />;
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
          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setTableDensity('comfortable')}
              className={cn('px-2.5 py-1 text-xs font-medium rounded-md transition-colors', tableDensity === 'comfortable' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200')}
            >
              Comfortable
            </button>
            <button
              onClick={() => setTableDensity('compact')}
              className={cn('px-2.5 py-1 text-xs font-medium rounded-md transition-colors', tableDensity === 'compact' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200')}
            >
              Compact
            </button>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowColSettings(!showColSettings)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-900/50 border border-slate-700/60 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Columns
            </button>
            {showColSettings && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-2">
                {columns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => toggleCol(col.key)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition-colors text-left"
                  >
                    <span>{col.header}</span>
                    {hiddenCols.has(col.key) ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={cn('overflow-hidden rounded-xl border border-slate-700/50 shadow-lg shadow-black/20')}>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-sm relative">
            {/* Head */}
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-slate-700/60" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
                {visibleColumns.map((col, idx) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ background: 'rgba(15, 23, 42, 0.95)', ...(col.width ? { width: col.width } : {}) }}
                  className={cn(
                    cellPadding,
                    'text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-300 transition-colors',
                    idx === 0 && 'sticky left-0 z-30 border-r border-slate-700/40'
                  )}
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
                    'border-b border-slate-700/30 group',
                    'transition-colors duration-100',
                    onRowClick ? 'cursor-pointer hover:bg-cyan-500/5' : 'hover:bg-slate-700/30',
                    rowClassName?.(row)
                  )}
                >
                  {visibleColumns.map((col, idx) => (
                    <td
                      key={col.key}
                      className={cn(
                        cellPadding,
                        'text-slate-300 whitespace-nowrap transition-colors duration-100',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        idx === 0 && 'sticky left-0 z-10 border-r border-slate-700/40 backdrop-blur-sm',
                        idx === 0 && (onRowClick ? 'group-hover:bg-cyan-950/40' : 'group-hover:bg-slate-800/90')
                      )}
                      style={idx === 0 ? { background: 'inherit' } : undefined}
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
