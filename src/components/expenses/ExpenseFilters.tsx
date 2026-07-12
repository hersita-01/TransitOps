import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import type { ExpenseCategory } from '@/types';

export interface ExpenseFilterState {
  search: string;
  vehicleId: string;
  category: ExpenseCategory | '';
  startDate: string;
  endDate: string;
}

interface ExpenseFiltersProps {
  filters: ExpenseFilterState;
  onChange: (filters: ExpenseFilterState) => void;
  onReset: () => void;
}

export function ExpenseFilters({ filters, onChange, onReset }: ExpenseFiltersProps): React.JSX.Element {
  const handleChange = (key: keyof ExpenseFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 mb-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-medium text-slate-300">Filter Expenses</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search vendor or desc..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Vehicle */}
        <div>
          <select
            value={filters.vehicleId}
            onChange={(e) => handleChange('vehicleId', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">All Vehicles</option>
            {MOCK_VEHICLES.map((v) => (
              <option key={v.id} value={v.id}>{v.plateNumber}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">All Categories</option>
            <option value="fuel">Fuel</option>
            <option value="maintenance">Maintenance</option>
            <option value="insurance">Insurance</option>
            <option value="tyres">Tyres</option>
            <option value="repairs">Repairs</option>
            <option value="tolls">Tolls</option>
            <option value="permits">Permits</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        
        {/* End Date */}
        <div>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-end pt-3 mt-3 border-t border-slate-700/50">
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
