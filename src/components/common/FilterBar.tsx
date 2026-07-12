import React from 'react';
import { cn } from '@/utils';
import type { FilterOption } from '@/types';

interface FilterBarProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  className?: string;
  id?: string;
}

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  className,
  id = 'filter-bar',
}: FilterBarProps): React.JSX.Element {
  return (
    <div
      id={id}
      role="tablist"
      aria-label="Filter options"
      className={cn('flex items-center gap-1 flex-wrap', className)}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
              isActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
