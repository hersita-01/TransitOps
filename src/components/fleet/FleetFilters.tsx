import React from 'react';
import { Search, X } from 'lucide-react';

export interface FleetFilterState {
  search: string;
  status: string;
  type: string;
  fuelType: string;
}

interface FleetFiltersProps {
  filters: FleetFilterState;
  onChange: (filters: FleetFilterState) => void;
  onReset: () => void;
}

export function FleetFilters({ filters, onChange, onReset }: FleetFiltersProps): React.JSX.Element {
  const hasActiveFilters = filters.search || filters.status || filters.type || filters.fuelType;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by Plate or Model..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="py-2 pl-3 pr-8 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="idle">Idle / Available</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>

        {/* Type Dropdown */}
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="py-2 pl-3 pr-8 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
        >
          <option value="">All Types</option>
          <option value="bus">Bus</option>
          <option value="van">Van</option>
          <option value="truck">Truck</option>
          <option value="sedan">Sedan</option>
        </select>

        {/* Fuel Type Dropdown */}
        <select
          value={filters.fuelType}
          onChange={(e) => onChange({ ...filters, fuelType: e.target.value })}
          className="py-2 pl-3 pr-8 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
        >
          <option value="">All Fuel Types</option>
          <option value="diesel">Diesel</option>
          <option value="gasoline">Gasoline</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
