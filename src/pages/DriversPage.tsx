import React, { useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { useSearch } from '@/hooks/useSearch';
import { MOCK_DRIVERS } from '@/services/mockData';
import { formatDate, getInitials } from '@/utils';
import type { Driver, FilterOption } from '@/types';

const FILTERS: FilterOption[] = [
  { label: 'All Drivers',  value: 'all' },
  { label: 'Available',   value: 'available' },
  { label: 'On Trip',     value: 'on_trip' },
  { label: 'Off Duty',    value: 'off_duty' },
  { label: 'Suspended',   value: 'suspended' },
];

const COLUMNS: ColumnDef<Driver>[] = [
  {
    key: 'driver',
    header: 'Driver',
    accessor: (d) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {getInitials(d.firstName, d.lastName)}
        </div>
        <div>
          <p className="text-slate-200 font-medium">{d.firstName} {d.lastName}</p>
          <p className="text-xs text-slate-500">{d.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    accessor: (d) => <StatusBadge status={d.status} />,
    sortable: true,
  },
  {
    key: 'license',
    header: 'License',
    accessor: (d) => (
      <div>
        <p className="text-slate-300 font-mono text-xs">{d.licenseNumber}</p>
        <p className={`text-xs mt-0.5 ${new Date(d.licenseExpiry) < new Date() ? 'text-red-400' : 'text-slate-500'}`}>
          Expires {formatDate(d.licenseExpiry)}
        </p>
      </div>
    ),
  },
  {
    key: 'trips',
    header: 'Total Trips',
    accessor: (d) => <span className="text-slate-300 font-semibold">{d.totalTrips}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'distance',
    header: 'Distance',
    accessor: (d) => <span className="text-slate-300">{d.totalDistance.toLocaleString()} km</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'rating',
    header: 'Rating',
    accessor: (d) => (
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-slate-300 text-sm font-medium">{d.rating.toFixed(1)}</span>
      </div>
    ),
    sortable: true,
    align: 'right',
  },
  {
    key: 'phone',
    header: 'Phone',
    accessor: (d) => <span className="text-slate-400 text-xs">{d.phone}</span>,
  },
];

export function DriversPage(): React.JSX.Element {
  const { query, setQuery } = useSearch();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = MOCK_DRIVERS.filter((d) => {
    const matchFilter = filter === 'all' || d.status === filter;
    const q = query.toLowerCase();
    const matchSearch =
      !q ||
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.licenseNumber.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageTitle
        title="Drivers"
        subtitle={`${MOCK_DRIVERS.length} registered drivers · ${MOCK_DRIVERS.filter((d) => d.status === 'on_trip').length} currently on trip`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Drivers' }]}
        actions={
          <button
            id="add-driver-btn"
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar
          id="drivers-search"
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, license…"
          className="sm:max-w-sm"
        />
        <FilterBar
          id="drivers-filter"
          filters={FILTERS}
          activeFilter={filter}
          onFilterChange={(v) => { setFilter(v); setPage(1); }}
        />
      </div>

      <DataTable<Driver>
        id="drivers-table"
        columns={COLUMNS}
        data={paginated}
        keyExtractor={(d) => d.id}
        emptyTitle="No drivers found"
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
