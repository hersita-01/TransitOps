import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  id = 'search-bar',
}: SearchBarProps): React.JSX.Element {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'w-full pl-9 pr-9 py-2 rounded-lg text-sm',
          'bg-slate-800 border border-slate-700',
          'text-slate-100 placeholder:text-slate-500',
          'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
          'transition-colors duration-150'
        )}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
