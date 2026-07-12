import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MOCK_VEHICLES } from '@/services/mockData';
import { useExpenses } from '@/hooks/useExpenses';
import { formatDateTime, humaniseKey } from '@/utils';
import type { Expense, ExpenseCategory } from '@/types';
import { ExpenseFilters, type ExpenseFilterState } from '@/components/expenses/ExpenseFilters';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { ExpenseCharts } from '@/components/expenses/ExpenseCharts';
import { FuelSummaryCards } from '@/components/expenses/FuelSummaryCards';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  fuel: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  maintenance: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  insurance: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  tyres: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  repairs: 'bg-red-500/15 text-red-400 border-red-500/30',
  tolls: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  permits: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  miscellaneous: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export function ExpensesPage(): React.JSX.Element {
  // ── State ────────────────────────────────────────────────────────
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [filters, setFilters] = useState<ExpenseFilterState>({
    search: '',
    vehicleId: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Modals State ──────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleCreate = () => { setSelectedExpense(null); setFormOpen(true); };
  const handleOpenEdit = (e: Expense) => { setSelectedExpense(e); setFormOpen(true); };
  const handleOpenDelete = (e: Expense) => { setSelectedExpense(e); setDeleteOpen(true); };

  const handleSaveForm = (data: Partial<Expense>) => {
    if (selectedExpense) {
      updateExpense(selectedExpense.id, data);
    } else {
      addExpense(data);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedExpense) {
      deleteExpense(selectedExpense.id);
      setDeleteOpen(false);
    }
  };

  // ── Derived Data ──────────────────────────────────────────────────
  const { paginated, total } = useMemo(() => {
    let result = [...expenses];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((e) => 
        e.description.toLowerCase().includes(q) || 
        (e.vendor && e.vendor.toLowerCase().includes(q)) ||
        e.id.toLowerCase().includes(q)
      );
    }

    if (filters.vehicleId) result = result.filter((e) => e.vehicleId === filters.vehicleId);
    if (filters.category) result = result.filter((e) => e.category === filters.category);
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      result = result.filter((e) => new Date(e.date).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      result = result.filter((e) => new Date(e.date).getTime() <= end + 86400000);
    }

    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const pag = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return { paginated: pag, total: result.length };
  }, [expenses, filters, page]);

  useEffect(() => {
    const maxPage = Math.ceil(total / PAGE_SIZE);
    if (page > maxPage && maxPage > 0) setPage(maxPage);
  }, [total, page]);

  // KPI Calculations
  const fuelCost = expenses.filter(e => e.category === 'fuel').reduce((s, e) => s + e.amountUsd, 0);
  const maintCost = expenses.filter(e => e.category === 'maintenance' || e.category === 'repairs' || e.category === 'tyres').reduce((s, e) => s + e.amountUsd, 0);
  const otherCost = expenses.filter(e => e.category !== 'fuel' && e.category !== 'maintenance' && e.category !== 'repairs' && e.category !== 'tyres').reduce((s, e) => s + e.amountUsd, 0);
  const totalCost = fuelCost + maintCost + otherCost;

  // ── Columns ───────────────────────────────────────────────────────
  const columns: ColumnDef<Expense>[] = [
    {
      key: 'id',
      header: 'ID',
      accessor: (e) => <span className="font-mono text-[11px] font-medium text-slate-300">#{e.id.replace('exp_', '').toUpperCase()}</span>,
    },
    {
      key: 'date',
      header: 'Date',
      accessor: (e) => <span className="text-slate-300 text-xs">{formatDateTime(e.date).split(',')[0]}</span>,
      sortable: true,
    },
    {
      key: 'vehicle',
      header: 'Vehicle',
      accessor: (e) => {
        if (!e.vehicleId) return <span className="text-slate-500 text-xs">—</span>;
        const v = MOCK_VEHICLES.find((v) => v.id === e.vehicleId);
        return <span className="font-mono text-xs text-slate-300">{v?.plateNumber ?? e.vehicleId}</span>;
      },
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (e) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${CATEGORY_COLORS[e.category]}`}>
          {humaniseKey(e.category)}
        </span>
      ),
    },
    {
      key: 'vendor_desc',
      header: 'Vendor / Description',
      accessor: (e) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-200 font-medium truncate max-w-[180px]">{e.vendor || 'Unknown Vendor'}</span>
          <span className="text-[10px] text-slate-400 truncate max-w-[180px]">{e.description}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: (e) => <span className="text-slate-100 font-semibold">${e.amountUsd.toFixed(2)}</span>,
      align: 'right',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (e) => {
        if (e.status === 'approved') return <span className="text-emerald-400 text-xs font-medium">Approved</span>;
        if (e.status === 'rejected') return <span className="text-red-400 text-xs font-medium">Rejected</span>;
        return <span className="text-amber-400 text-xs font-medium">Pending</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (e) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => handleOpenEdit(e)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Expense">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenDelete(e)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors" title="Delete Expense">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageTitle
        title="Fuel & Expense Management"
        subtitle="Track, analyze, and manage fleet operational costs"
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Expenses' }]}
        actions={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Log Expense
          </button>
        }
      />

      {/* KPI Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Monthly Fuel Cost" value={`$${fuelCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="text-amber-400" />
        <MetricCard label="Monthly Maintenance" value={`$${maintCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="text-blue-400" />
        <MetricCard label="Other Expenses" value={`$${otherCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="text-purple-400" />
        <MetricCard label="Total Operational Cost" value={`$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="text-emerald-400" highlight />
      </div>

      {/* Recharts Analytics */}
      <ExpenseCharts expenses={expenses} />
      
      {/* Fuel Summary Cards */}
      <FuelSummaryCards expenses={expenses} />

      <ExpenseFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={() => setFilters({ search: '', vehicleId: '', category: '', startDate: '', endDate: '' })}
      />

      <DataTable<Expense>
        columns={columns}
        data={paginated}
        keyExtractor={(e) => e.id}
        emptyTitle="No expenses found"
        emptyDescription="Try adjusting your filters or search query."
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />

      {/* Modals */}
      <ExpenseFormModal open={formOpen} onOpenChange={setFormOpen} initialData={selectedExpense} onSave={handleSaveForm} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Expense"
        description={`Are you sure you want to delete this expense record #${selectedExpense?.id.replace('exp_', '').toUpperCase()}? This action cannot be undone.`}
        confirmText="Delete"
        destructive={true}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function MetricCard({ label, value, color, highlight = false }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl bg-slate-900/50 p-4 shadow-sm flex flex-col justify-center border ${highlight ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-700/50'}`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
    </div>
  );
}
