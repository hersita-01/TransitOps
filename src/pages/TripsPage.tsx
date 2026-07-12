import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Send, CheckCircle, XCircle, MapPin, Clock } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MOCK_VEHICLES, MOCK_DRIVERS } from '@/services/mockData';
import { useTrips } from '@/hooks/useTrips';
import { formatDateTime } from '@/utils';
import type { Trip } from '@/types';
import { TripFilters, type TripFilterState } from '@/components/trips/TripFilters';
import { TripDetailsModal } from '@/components/trips/TripDetailsModal';
import { TripFormModal } from '@/components/trips/TripFormModal';

export function TripsPage(): React.JSX.Element {
  // ── State ────────────────────────────────────────────────────────
  const { trips, addTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip, deleteTrip } = useTrips();
  const [filters, setFilters] = useState<TripFilterState>({
    search: '',
    origin: '',
    destination: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Modals State ──────────────────────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleCreate = () => { setSelectedTrip(null); setFormOpen(true); };
  const handleOpenDetails = (t: Trip) => { setSelectedTrip(t); setDetailsOpen(true); };
  const handleOpenEdit = (t: Trip) => { setSelectedTrip(t); setFormOpen(true); };
  const handleOpenDelete = (t: Trip) => { setSelectedTrip(t); setDeleteOpen(true); };

  const handleSaveForm = (data: Partial<Trip>) => {
    if (selectedTrip) {
      updateTrip(selectedTrip.id, data);
    } else {
      addTrip(data);
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedTrip) {
      deleteTrip(selectedTrip.id);
      setDeleteOpen(false);
    }
  };

  const handleUpdateStatus = (t: Trip, status: Trip['status']) => {
    if (status === 'dispatched' || status === 'in_progress') dispatchTrip(t.id);
    else if (status === 'completed') completeTrip(t.id);
    else if (status === 'cancelled') cancelTrip(t.id);
    else updateTrip(t.id, { status });
  };

  // ── Derived Data ──────────────────────────────────────────────────
  const { paginated, total } = useMemo(() => {
    let result = [...trips];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) => {
        const v = MOCK_VEHICLES.find((v) => v.id === t.vehicleId);
        const d = MOCK_DRIVERS.find((d) => d.id === t.driverId);
        return (
          t.id.toLowerCase().includes(q) ||
          v?.plateNumber.toLowerCase().includes(q) ||
          d?.firstName.toLowerCase().includes(q) ||
          d?.lastName.toLowerCase().includes(q)
        );
      });
    }

    if (filters.origin) {
      result = result.filter((t) => t.origin.toLowerCase().includes(filters.origin.toLowerCase()));
    }
    if (filters.destination) {
      result = result.filter((t) => t.destination.toLowerCase().includes(filters.destination.toLowerCase()));
    }
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      result = result.filter((t) => new Date(t.scheduledStart).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      // add 1 day to include the end date fully
      result = result.filter((t) => new Date(t.scheduledStart).getTime() <= end + 86400000);
    }

    // Default sort by scheduledStart desc
    result.sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());

    // Paginate
    const pag = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return { paginated: pag, total: result.length };
  }, [trips, filters, page]);

  useEffect(() => {
    const maxPage = Math.ceil(total / PAGE_SIZE);
    if (page > maxPage && maxPage > 0) setPage(maxPage);
  }, [total, page]);

  // ── Columns ───────────────────────────────────────────────────────
  const columns: ColumnDef<Trip>[] = [
    {
      key: 'id',
      header: 'Trip ID',
      accessor: (t) => <span className="font-mono text-[11px] font-medium text-slate-300">#{t.id.replace('trp_', '').toUpperCase()}</span>,
    },
    {
      key: 'assignment',
      header: 'Assignment',
      accessor: (t) => {
        const v = MOCK_VEHICLES.find((v) => v.id === t.vehicleId);
        const d = MOCK_DRIVERS.find((d) => d.id === t.driverId);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-200">{d ? `${d.firstName} ${d.lastName}` : 'Unassigned'}</span>
            <span className="text-[10px] text-slate-400 font-mono">{v?.plateNumber ?? 'Unassigned'}</span>
          </div>
        );
      },
    },
    {
      key: 'route',
      header: 'Route',
      accessor: (t) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 truncate max-w-[140px]" title={t.origin}>{t.origin}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-xs text-slate-400 truncate max-w-[140px]" title={t.destination}>{t.destination}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'Schedule',
      accessor: (t) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Clock className="w-3 h-3" />
            <span>Dep: {formatDateTime(t.scheduledStart)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
            <span>Arr: {formatDateTime(t.scheduledEnd)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'cargo',
      header: 'Cargo',
      accessor: (t) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-300 truncate max-w-[120px]" title={t.cargoDescription || ''}>{t.cargoDescription || '—'}</span>
          <span className="text-[10px] text-slate-500">{t.cargoWeight ? `${t.cargoWeight} kg` : ''}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (t) => {
        const canDispatch = t.status === 'draft' || t.status === 'scheduled';
        const canComplete = t.status === 'dispatched' || t.status === 'in_progress';
        const canCancel = t.status !== 'completed' && t.status !== 'cancelled';
        
        return (
          <div className="flex items-center justify-end gap-1">
            {canDispatch && (
              <button onClick={() => handleUpdateStatus(t, 'dispatched')} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors" title="Dispatch">
                <Send className="w-4 h-4" />
              </button>
            )}
            {canComplete && (
              <button onClick={() => handleUpdateStatus(t, 'completed')} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors" title="Complete">
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            {canCancel && (
              <button onClick={() => handleUpdateStatus(t, 'cancelled')} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors" title="Cancel">
                <XCircle className="w-4 h-4" />
              </button>
            )}
            <div className="w-px h-4 bg-slate-700/50 mx-1" />
            <button onClick={() => handleOpenDetails(t)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors" title="View Details">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => handleOpenEdit(t)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Trip">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleOpenDelete(t)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors" title="Delete Trip">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const metrics = {
    total: trips.length,
    active: trips.filter(t => t.status === 'in_progress' || t.status === 'dispatched').length,
    completed: trips.filter(t => t.status === 'completed').length,
    cancelled: trips.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div>
      <PageTitle
        title="Trip Management"
        subtitle={`${metrics.total} Total · ${metrics.active} Active · ${metrics.completed} Completed · ${metrics.cancelled} Cancelled`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Trips' }]}
        actions={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Schedule Trip
          </button>
        }
      />

      <TripFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={() => setFilters({ search: '', origin: '', destination: '', status: '', startDate: '', endDate: '' })}
      />

      <DataTable<Trip>
        columns={columns}
        data={paginated}
        keyExtractor={(t) => t.id}
        emptyTitle="No trips found"
        emptyDescription="Try adjusting your filters or search query."
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />

      {/* Modals */}
      <TripDetailsModal open={detailsOpen} onOpenChange={setDetailsOpen} trip={selectedTrip} />
      <TripFormModal open={formOpen} onOpenChange={setFormOpen} initialData={selectedTrip} onSave={handleSaveForm} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Trip"
        description={`Are you sure you want to remove trip #${selectedTrip?.id.replace('trp_', '').toUpperCase()}? This action cannot be undone.`}
        confirmText="Delete Trip"
        destructive={true}
        onConfirm={handleDelete}
      />
    </div>
  );
}
