import React from 'react';
import { Search, X } from 'lucide-react';

export interface DriverFilterState {
  search: string;
  status: string;
  assignment: string;
  licenseStatus: string;
}

interface DriverFiltersProps {
  filters: DriverFilterState;
  onChange: (filters: DriverFilterState) => void;
  onReset: () => void;
}

export function DriverFilters({ filters, onChange, onReset }: DriverFiltersProps): React.JSX.Element {
  const hasActiveFilters = filters.search || filters.status || filters.assignment || filters.licenseStatus;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by Name, ID, or License..."
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
          <option value="available">Available</option>
          <option value="on_trip">On Trip</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* Assignment Filter */}
        <select
          value={filters.assignment}
          onChange={(e) => onChange({ ...filters, assignment: e.target.value })}
          className="py-2 pl-3 pr-8 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
        >
          <option value="">All Assignments</option>
          <option value="assigned">Assigned to Vehicle</option>
          <option value="unassigned">Unassigned</option>
        </select>

        {/* License Filter */}
        <select
          value={filters.licenseStatus}
          onChange={(e) => onChange({ ...filters, licenseStatus: e.target.value })}
          className="py-2 pl-3 pr-8 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
        >
          <option value="">All License Status</option>
          <option value="valid">Valid</option>
          <option value="expiring">Expiring Soon (30d)</option>
          <option value="expired">Expired</option>
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
