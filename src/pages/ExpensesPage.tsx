import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { SearchBar } from '@/components/common/SearchBar';
import { FilterBar } from '@/components/common/FilterBar';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { useSearch } from '@/hooks/useSearch';
import { MOCK_EXPENSES, MOCK_VEHICLES, MOCK_DRIVERS } from '@/services/mockData';
import { formatDate, humaniseKey } from '@/utils';
import type { Expense, FilterOption, ExpenseCategory } from '@/types';

const FILTERS: FilterOption[] = [
  { label: 'All',          value: 'all' },
  { label: 'Fuel',         value: 'fuel' },
  { label: 'Maintenance',  value: 'maintenance' },
  { label: 'Tolls',        value: 'tolls' },
  { label: 'Insurance',    value: 'insurance' },
  { label: 'Other',        value: 'other' },
];

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  fuel:        'bg-amber-500/15 text-amber-400 border-amber-500/30',
  maintenance: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  tolls:       'bg-purple-500/15 text-purple-400 border-purple-500/30',
  insurance:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  other:       'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

const COLUMNS: ColumnDef<Expense>[] = [
  {
    key: 'id',
    header: 'ID',
    accessor: (e) => <span className="font-mono text-xs text-slate-400">#{e.id.toUpperCase()}</span>,
  },
  {
    key: 'category',
    header: 'Category',
    accessor: (e) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[e.category]}`}>
        {humaniseKey(e.category)}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'description',
    header: 'Description',
    accessor: (e) => <span className="text-slate-300 text-xs">{e.description}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    accessor: (e) => <span className="text-slate-100 font-semibold">${e.amountUsd.toFixed(2)}</span>,
    sortable: true,
    align: 'right',
  },
  {
    key: 'vehicle',
    header: 'Vehicle',
    accessor: (e) => {
      if (!e.vehicleId) return <span className="text-slate-500">—</span>;
      const v = MOCK_VEHICLES.find((v) => v.id === e.vehicleId);
      return <span className="font-mono text-xs text-slate-300">{v?.plateNumber ?? e.vehicleId}</span>;
    },
  },
  {
    key: 'driver',
    header: 'Driver',
    accessor: (e) => {
      if (!e.driverId) return <span className="text-slate-500">—</span>;
      const d = MOCK_DRIVERS.find((d) => d.id === e.driverId);
      return <span className="text-slate-300 text-xs">{d ? `${d.firstName} ${d.lastName}` : e.driverId}</span>;
    },
  },
  {
    key: 'date',
    header: 'Date',
    accessor: (e) => <span className="text-slate-400 text-xs">{formatDate(e.date)}</span>,
    sortable: true,
  },
  {
    key: 'approved',
    header: 'Approved',
    accessor: (e) => (
      <span className={e.approvedBy ? 'text-emerald-400 text-xs' : 'text-amber-400 text-xs'}>
        {e.approvedBy ? '✓ Approved' : 'Pending'}
      </span>
    ),
  },
];

export function ExpensesPage(): React.JSX.Element {
  const { query, setQuery } = useSearch();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalAmount = MOCK_EXPENSES.reduce((sum, e) => sum + e.amountUsd, 0);

  const filtered = MOCK_EXPENSES.filter((e) => {
    const matchFilter = filter === 'all' || e.category === filter;
    const q = query.toLowerCase();
    const matchSearch = !q || e.description.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageTitle
        title="Expenses"
        subtitle={`Total recorded: $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} · ${MOCK_EXPENSES.length} entries`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Expenses' }]}
        actions={
          <button
            id="add-expense-btn"
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Log Expense
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar
          id="expenses-search"
          value={query}
          onChange={setQuery}
          placeholder="Search expenses…"
          className="sm:max-w-sm"
        />
        <FilterBar
          id="expenses-filter"
          filters={FILTERS}
          activeFilter={filter}
          onFilterChange={(v) => { setFilter(v); setPage(1); }}
        />
      </div>

      <DataTable<Expense>
        id="expenses-table"
        columns={COLUMNS}
        data={paginated}
        keyExtractor={(e) => e.id}
        emptyTitle="No expenses found"
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
