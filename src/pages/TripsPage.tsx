import React, { useState } from 'react';
import { Plus, MapPin, Clock } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { useSearch } from '@/hooks/useSearch';
import { MOCK_TRIPS, MOCK_VEHICLES, MOCK_DRIVERS } from '@/services/mockData';
import { formatDateTime } from '@/utils';
import type { Trip, FilterOption } from '@/types';

const FILTERS: FilterOption[] = [
  { label: 'All Trips',   value: 'all' },
  { label: 'Scheduled',   value: 'scheduled' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
  { label: 'Cancelled',   value: 'cancelled' },
];

const COLUMNS: ColumnDef<Trip>[] = [
  {
    key: 'id',
    header: 'Trip ID',
    accessor: (t) => <span className="font-mono text-xs text-slate-400">#{t.id.toUpperCase()}</span>,
  },
  {
    key: 'route',
    header: 'Route',
    accessor: (t) => (
      <div>
        <div className="flex items-center gap-1 text-slate-200 font-medium text-xs">
          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[140px]">{t.origin}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
          <span className="truncate max-w-[140px]">{t.destination}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (t) => <StatusBadge status={t.status} />,
    sortable: true,
  },
  {
    key: 'vehicle',
    header: 'Vehicle',
    accessor: (t) => {
      const v = MOCK_VEHICLES.find((v) => v.id === t.vehicleId);
      return <span className="text-slate-300 font-mono text-xs">{v?.plateNumber ?? t.vehicleId}</span>;
    },
  },
  {
    key: 'driver',
    header: 'Driver',
    accessor: (t) => {
      const d = MOCK_DRIVERS.find((d) => d.id === t.driverId);
      return <span className="text-slate-300 text-xs">{d ? `${d.firstName} ${d.lastName}` : '—'}</span>;
    },
  },
  {
    key: 'scheduled',
    header: 'Scheduled Start',
    accessor: (t) => (
      <span className="flex items-center gap-1 text-slate-400 text-xs">
        <Clock className="w-3 h-3" />
        {formatDateTime(t.scheduledStart)}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'distance',
    header: 'Distance',
    accessor: (t) => <span className="text-slate-300">{t.distanceKm} km</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'passengers',
    header: 'Passengers',
    accessor: (t) => <span className="text-slate-400">{t.passengerCount ?? '—'}</span>,
    align: 'right',
  },
];

export function TripsPage(): React.JSX.Element {
  const { query, setQuery } = useSearch();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = MOCK_TRIPS.filter((t) => {
    const matchFilter = filter === 'all' || t.status === filter;
    const q = query.toLowerCase();
    const matchSearch =
      !q ||
      t.origin.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageTitle
        title="Trips"
        subtitle={`${MOCK_TRIPS.length} total trips · ${MOCK_TRIPS.filter((t) => t.status === 'in_progress').length} in progress`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Trips' }]}
        actions={
          <button
            id="schedule-trip-btn"
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Schedule Trip
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar
          id="trips-search"
          value={query}
          onChange={setQuery}
          placeholder="Search by origin, destination, ID…"
          className="sm:max-w-sm"
        />
        <FilterBar
          id="trips-filter"
          filters={FILTERS}
          activeFilter={filter}
          onFilterChange={(v) => { setFilter(v); setPage(1); }}
        />
      </div>

      <DataTable<Trip>
        id="trips-table"
        columns={COLUMNS}
        data={paginated}
        keyExtractor={(t) => t.id}
        emptyTitle="No trips found"
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
