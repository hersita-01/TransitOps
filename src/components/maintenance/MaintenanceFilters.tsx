import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import type { MaintenanceStatus } from '@/types';

export interface MaintenanceFilterState {
  search: string;
  status: MaintenanceStatus | '';
  type: string;
  priority: string;
  startDate: string;
  endDate: string;
}

interface MaintenanceFiltersProps {
  filters: MaintenanceFilterState;
  onChange: (filters: MaintenanceFilterState) => void;
  onReset: () => void;
}

export function MaintenanceFilters({ filters, onChange, onReset }: MaintenanceFiltersProps): React.JSX.Element {
  const handleChange = (key: keyof MaintenanceFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 mb-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-medium text-slate-300">Filter Maintenance Records</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Search */}
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID or Registration..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Status */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">All Types</option>
            <option value="oil_change">Oil Change</option>
            <option value="tire_rotation">Tire Rotation</option>
            <option value="brake_service">Brake Service</option>
            <option value="engine_check">Engine Check</option>
            <option value="full_service">Full Service</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Date Range (Start) */}
        <div>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            title="Start Date"
          />
        </div>
      </div>

      {/* Date Range End & Reset */}
      <div className="flex justify-between items-center border-t border-slate-700/50 pt-3 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">To:</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
