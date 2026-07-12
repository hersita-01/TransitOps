import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { useSearch } from '@/hooks/useSearch';
import { MOCK_VEHICLES } from '@/services/mockData';
import { formatDate } from '@/utils';
import type { Vehicle, FilterOption } from '@/types';

const FILTERS: FilterOption[] = [
  { label: 'All Vehicles', value: 'all' },
  { label: 'Active',       value: 'active' },
  { label: 'Idle',         value: 'idle' },
  { label: 'Maintenance',  value: 'maintenance' },
  { label: 'Offline',      value: 'offline' },
];

const COLUMNS: ColumnDef<Vehicle>[] = [
  {
    key: 'plate',
    header: 'Plate Number',
    accessor: (v) => <span className="font-mono font-semibold text-slate-200">{v.plateNumber}</span>,
    sortable: true,
  },
  {
    key: 'vehicle',
    header: 'Vehicle',
    accessor: (v) => (
      <div>
        <p className="text-slate-200 font-medium">{v.make} {v.model}</p>
        <p className="text-xs text-slate-500 capitalize">{v.type} · {v.year}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (v) => <StatusBadge status={v.status} />,
    sortable: true,
  },
  {
    key: 'fuel',
    header: 'Fuel Level',
    accessor: (v) => (
      <div className="flex items-center gap-2 min-w-[100px]">
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${v.fuelLevel}%`,
              backgroundColor: v.fuelLevel > 50 ? '#10b981' : v.fuelLevel > 25 ? '#f59e0b' : '#ef4444',
            }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{v.fuelLevel}%</span>
      </div>
    ),
  },
  {
    key: 'mileage',
    header: 'Mileage',
    accessor: (v) => <span className="text-slate-300">{v.mileage.toLocaleString()} km</span>,
    sortable: true,
  },
  {
    key: 'nextService',
    header: 'Next Service',
    accessor: (v) => (
      <span className={
        new Date(v.nextServiceDue) < new Date()
          ? 'text-red-400 font-medium'
          : 'text-slate-300'
      }>
        {formatDate(v.nextServiceDue)}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'location',
    header: 'Location',
    accessor: (v) => (
      <span className="text-slate-400 text-xs truncate max-w-[160px] block">
        {v.location?.address ?? '—'}
      </span>
    ),
  },
];

export function FleetPage(): React.JSX.Element {
  const { query, setQuery } = useSearch();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = MOCK_VEHICLES.filter((v) => {
    const matchFilter = filter === 'all' || v.status === filter;
    const q = query.toLowerCase();
    const matchSearch =
      !q ||
      v.plateNumber.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageTitle
        title="Fleet Management"
        subtitle={`${MOCK_VEHICLES.length} vehicles registered · ${MOCK_VEHICLES.filter((v) => v.status === 'active').length} currently active`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Fleet' }]}
        actions={
          <button
            id="add-vehicle-btn"
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        }
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar
          id="fleet-search"
          value={query}
          onChange={setQuery}
          placeholder="Search by plate, make, model…"
          className="sm:max-w-sm"
        />
        <FilterBar
          id="fleet-filter"
          filters={FILTERS}
          activeFilter={filter}
          onFilterChange={(v) => { setFilter(v); setPage(1); }}
        />
      </div>

      {/* Table */}
      <DataTable<Vehicle>
        id="fleet-table"
        columns={COLUMNS}
        data={paginated}
        keyExtractor={(v) => v.id}
        emptyTitle="No vehicles found"
        emptyDescription="Try adjusting your search or filter criteria."
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
