import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/utils';
import { EmptyState } from './EmptyState';
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
        <tr key={i} className="border-b border-slate-700/50">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-slate-700 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
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
}: DataTableProps<T>): React.JSX.Element {
  const [internalSort, setInternalSort] = useState<SortState | undefined>(sort);

  function handleSort(key: string): void {
    const newSort: SortState = {
      column: key,
      direction: internalSort?.column === key && internalSort.direction === 'asc' ? 'desc' : 'asc',
    };
    setInternalSort(newSort);
    onSort?.(newSort);
  }

  const activeSort = sort ?? internalSort;

  return (
    <div id={id} className={cn('overflow-hidden rounded-xl border border-slate-700/60', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Head */}
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-200 transition-colors'
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
              <SkeletonRows cols={columns.length} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'border-b border-slate-700/40 bg-slate-800/30',
                    'hover:bg-slate-700/40 transition-colors duration-100',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row)
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-slate-300 whitespace-nowrap',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right'
                      )}
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
  );
}
