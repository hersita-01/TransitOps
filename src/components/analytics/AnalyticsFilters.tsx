import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { MOCK_VEHICLES, MOCK_DRIVERS } from '@/services/mockData';

export interface AnalyticsFilterState {
  startDate: string;
  endDate: string;
  vehicleId: string;
  driverId: string;
  tripStatus: string;
  vehicleType: string;
  expenseCategory: string;
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFilterState;
  onChange: (filters: AnalyticsFilterState) => void;
  onReset: () => void;
}

export function AnalyticsFilters({ filters, onChange, onReset }: AnalyticsFiltersProps): React.JSX.Element {
  const handleChange = (key: keyof AnalyticsFilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 mb-8 space-y-4 print:hidden">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-medium text-slate-300">Global Filters</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Date Range Start */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        {/* Date Range End */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Vehicle */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Vehicle</label>
          <select
            value={filters.vehicleId}
            onChange={(e) => handleChange('vehicleId', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Vehicles</option>
            {MOCK_VEHICLES.map((v) => (
              <option key={v.id} value={v.id}>{v.plateNumber}</option>
            ))}
          </select>
        </div>

        {/* Driver */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Driver</label>
          <select
            value={filters.driverId}
            onChange={(e) => handleChange('driverId', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Drivers</option>
            {MOCK_DRIVERS.map((d) => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
            ))}
          </select>
        </div>

        {/* Trip Status */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Trip Status</label>
          <select
            value={filters.tripStatus}
            onChange={(e) => handleChange('tripStatus', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Vehicle Type</label>
          <select
            value={filters.vehicleType}
            onChange={(e) => handleChange('vehicleType', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="sedan">Sedan</option>
          </select>
        </div>

        {/* Expense Category */}
        <div>
          <label className="block text-[10px] text-slate-500 mb-1">Expense Category</label>
          <select
            value={filters.expenseCategory}
            onChange={(e) => handleChange('expenseCategory', e.target.value)}
            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="fuel">Fuel</option>
            <option value="maintenance">Maintenance</option>
            <option value="insurance">Insurance</option>
            <option value="tolls">Tolls</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
