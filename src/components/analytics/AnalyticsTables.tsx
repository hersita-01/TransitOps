import React from 'react';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDateTime, humaniseKey } from '@/utils';
import type { Expense, MaintenanceRecord, Trip, Vehicle, Driver } from '@/types';

interface AnalyticsTablesProps {
  topVehicles: (Vehicle & { tripCount: number; dist: number })[];
  topDrivers: (Driver & { tripCount: number })[];
  recentExpenses: Expense[];
  recentMaintenance: MaintenanceRecord[];
  recentTrips: Trip[];
}

export function AnalyticsTables({
  topVehicles,
  topDrivers,
  recentExpenses,
  recentMaintenance,
  recentTrips
}: AnalyticsTablesProps): React.JSX.Element {

  const vehicleCols: ColumnDef<Vehicle & { tripCount: number; dist: number }>[] = [
    { key: 'plate', header: 'Plate', accessor: (v) => <span className="font-mono text-xs">{v.plateNumber}</span> },
    { key: 'make', header: 'Vehicle', accessor: (v) => <span className="text-sm font-medium">{v.make} {v.model}</span> },
    { key: 'trips', header: 'Total Trips', accessor: (v) => <span className="text-slate-300">{v.tripCount}</span> },
    { key: 'dist', header: 'Distance', accessor: (v) => <span className="text-slate-300">{v.dist} km</span> },
  ];

  const driverCols: ColumnDef<Driver & { tripCount: number }>[] = [
    { key: 'name', header: 'Driver', accessor: (d) => <span className="text-sm font-medium">{d.firstName} {d.lastName}</span> },
    { key: 'trips', header: 'Total Trips', accessor: (d) => <span className="text-slate-300">{d.tripCount}</span> },
    { key: 'status', header: 'Status', accessor: (d) => <StatusBadge status={d.status} /> },
  ];

  const expenseCols: ColumnDef<Expense>[] = [
    { key: 'date', header: 'Date', accessor: (e) => <span className="text-xs text-slate-400">{e.date.split('T')[0]}</span> },
    { key: 'category', header: 'Category', accessor: (e) => <span className="text-xs font-medium uppercase">{humaniseKey(e.category)}</span> },
    { key: 'amount', header: 'Amount', accessor: (e) => <span className="font-semibold text-slate-200">${e.amountUsd.toFixed(2)}</span>, align: 'right' },
  ];

  const maintCols: ColumnDef<MaintenanceRecord>[] = [
    { key: 'date', header: 'Date', accessor: (m) => <span className="text-xs text-slate-400">{m.scheduledDate.split('T')[0]}</span> },
    { key: 'type', header: 'Type', accessor: (m) => <span className="text-xs font-medium uppercase">{humaniseKey(m.type)}</span> },
    { key: 'status', header: 'Status', accessor: (m) => <StatusBadge status={m.status} /> },
    { key: 'cost', header: 'Cost', accessor: (m) => <span className="font-semibold text-slate-200">${(m.actualCost || m.estimatedCost || 0).toFixed(2)}</span>, align: 'right' },
  ];

  const tripCols: ColumnDef<Trip>[] = [
    { key: 'start', header: 'Start', accessor: (t) => <span className="text-xs text-slate-400">{formatDateTime(t.scheduledStart).split(',')[0]}</span> },
    { key: 'route', header: 'Route', accessor: (t) => <span className="text-xs truncate max-w-[120px] block">{t.origin} → {t.destination}</span> },
    { key: 'status', header: 'Status', accessor: (t) => <StatusBadge status={t.status} /> },
    { key: 'dist', header: 'Distance', accessor: (t) => <span className="text-xs text-slate-300">{t.distanceKm} km</span>, align: 'right' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top 10 Most Active Vehicles</h3>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <DataTable columns={vehicleCols} data={topVehicles.slice(0, 10)} keyExtractor={(v) => v.id} />
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Top 10 Drivers by Trips</h3>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <DataTable columns={driverCols} data={topDrivers.slice(0, 10)} keyExtractor={(d) => d.id} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Expenses</h3>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <DataTable columns={expenseCols} data={recentExpenses.slice(0, 5)} keyExtractor={(e) => e.id} />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Maintenance</h3>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <DataTable columns={maintCols} data={recentMaintenance.slice(0, 5)} keyExtractor={(m) => m.id} />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Trips</h3>
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <DataTable columns={tripCols} data={recentTrips.slice(0, 5)} keyExtractor={(t) => t.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
