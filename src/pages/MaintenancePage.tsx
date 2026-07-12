import React, { useState } from 'react';
import { Plus, Wrench } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { useSearch } from '@/hooks/useSearch';
import { MOCK_MAINTENANCE, MOCK_VEHICLES, MOCK_MAINTENANCE_SUMMARY } from '@/services/mockData';
import { formatDate, humaniseKey } from '@/utils';
import type { MaintenanceRecord, FilterOption } from '@/types';

const FILTERS: FilterOption[] = [
  { label: 'All',         value: 'all' },
  { label: 'Pending',     value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Overdue',     value: 'overdue' },
  { label: 'Completed',   value: 'completed' },
];

const COLUMNS: ColumnDef<MaintenanceRecord>[] = [
  {
    key: 'id',
    header: 'ID',
    accessor: (m) => <span className="font-mono text-xs text-slate-400">#{m.id.toUpperCase()}</span>,
  },
  {
    key: 'vehicle',
    header: 'Vehicle',
    accessor: (m) => {
      const v = MOCK_VEHICLES.find((v) => v.id === m.vehicleId);
      return (
        <div>
          <p className="font-mono text-xs text-slate-200 font-semibold">{v?.plateNumber ?? m.vehicleId}</p>
          <p className="text-xs text-slate-500">{v ? `${v.make} ${v.model}` : ''}</p>
        </div>
      );
    },
  },
  {
    key: 'type',
    header: 'Type',
    accessor: (m) => (
      <div className="flex items-center gap-2">
        <Wrench className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-slate-300 text-xs">{humaniseKey(m.type)}</span>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (m) => <StatusBadge status={m.status} />,
    sortable: true,
  },
  {
    key: 'scheduled',
    header: 'Scheduled Date',
    accessor: (m) => (
      <span className={new Date(m.scheduledDate) < new Date() && m.status !== 'completed' ? 'text-red-400 font-medium' : 'text-slate-300'}>
        {formatDate(m.scheduledDate)}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'completed',
    header: 'Completed',
    accessor: (m) => (
      <span className="text-slate-400">{m.completedDate ? formatDate(m.completedDate) : '—'}</span>
    ),
  },
  {
    key: 'cost',
    header: 'Cost',
    accessor: (m) => (
      <span className="text-slate-300">{m.costUsd != null ? `$${m.costUsd.toFixed(2)}` : '—'}</span>
    ),
    align: 'right',
  },
  {
    key: 'technician',
    header: 'Technician',
    accessor: (m) => <span className="text-slate-400 text-xs">{m.technicianName ?? '—'}</span>,
  },
];

export function MaintenancePage(): React.JSX.Element {
  const { query, setQuery } = useSearch();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = MOCK_MAINTENANCE.filter((m) => {
    const matchFilter = filter === 'all' || m.status === filter;
    const q = query.toLowerCase();
    const v = MOCK_VEHICLES.find((v) => v.id === m.vehicleId);
    const matchSearch =
      !q ||
      m.description.toLowerCase().includes(q) ||
      (v?.plateNumber ?? '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageTitle
        title="Maintenance"
        subtitle="Track vehicle service schedules and repair history"
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Maintenance' }]}
        actions={
          <button
            id="schedule-maintenance-btn"
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Schedule Service
          </button>
        }
      />

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Pending',    value: MOCK_MAINTENANCE_SUMMARY.pending,    color: 'text-amber-400' },
          { label: 'In Progress',value: MOCK_MAINTENANCE_SUMMARY.inProgress, color: 'text-blue-400' },
          { label: 'Overdue',    value: MOCK_MAINTENANCE_SUMMARY.overdue,    color: 'text-red-400' },
          { label: 'Completed',  value: MOCK_MAINTENANCE_SUMMARY.completedThisMonth, color: 'text-emerald-400' },
          { label: 'Cost (Month)',value: `$${MOCK_MAINTENANCE_SUMMARY.totalCostThisMonthUsd}`, color: 'text-slate-200' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-800/60 border border-slate-700/60 px-4 py-3">
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar
          id="maintenance-search"
          value={query}
          onChange={setQuery}
          placeholder="Search by vehicle, description…"
          className="sm:max-w-sm"
        />
        <FilterBar
          id="maintenance-filter"
          filters={FILTERS}
          activeFilter={filter}
          onFilterChange={(v) => { setFilter(v); setPage(1); }}
        />
      </div>

      <DataTable<MaintenanceRecord>
        id="maintenance-table"
        columns={COLUMNS}
        data={paginated}
        keyExtractor={(m) => m.id}
        emptyTitle="No maintenance records"
        emptyDescription="All vehicles are up to date!"
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />
    </div>
  );
}
