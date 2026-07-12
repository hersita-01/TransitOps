import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, CheckCircle, Wrench } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MOCK_MAINTENANCE, MOCK_VEHICLES } from '@/services/mockData';
import { formatDateTime, humaniseKey } from '@/utils';
import type { MaintenanceRecord, Vehicle } from '@/types';
import { MaintenanceFilters, type MaintenanceFilterState } from '@/components/maintenance/MaintenanceFilters';
import { MaintenanceDetailsModal } from '@/components/maintenance/MaintenanceDetailsModal';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';

export function MaintenancePage(): React.JSX.Element {
  // ── State ────────────────────────────────────────────────────────
  const [records, setRecords] = useState<MaintenanceRecord[]>(MOCK_MAINTENANCE);
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [filters, setFilters] = useState<MaintenanceFilterState>({
    search: '',
    status: '',
    type: '',
    priority: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Modals State ──────────────────────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleCreate = () => { setSelectedRecord(null); setFormOpen(true); };
  const handleOpenDetails = (r: MaintenanceRecord) => { setSelectedRecord(r); setDetailsOpen(true); };
  const handleOpenEdit = (r: MaintenanceRecord) => { setSelectedRecord(r); setFormOpen(true); };
  const handleOpenDelete = (r: MaintenanceRecord) => { setSelectedRecord(r); setDeleteOpen(true); };

  const handleSaveForm = (data: Partial<MaintenanceRecord>) => {
    let savedRecord: MaintenanceRecord;
    if (selectedRecord) {
      savedRecord = { ...selectedRecord, ...data } as MaintenanceRecord;
      setRecords((prev) => prev.map((r) => (r.id === selectedRecord.id ? savedRecord : r)));
    } else {
      savedRecord = {
        ...(data as MaintenanceRecord),
        id: `maint_${Math.random().toString(36).substring(2, 9)}`,
        completedDate: data.status === 'completed' ? new Date().toISOString() : null,
        actualCost: null,
        partsUsed: null,
      };
      setRecords((prev) => [savedRecord, ...prev]);
    }
    syncVehicleStatus(savedRecord);
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (selectedRecord) {
      setRecords((prev) => prev.filter((r) => r.id !== selectedRecord.id));
      setDeleteOpen(false);
    }
  };

  const handleMarkCompleted = (r: MaintenanceRecord) => {
    const updatedRecord = { ...r, status: 'completed' as const, completedDate: new Date().toISOString() };
    setRecords((prev) => prev.map((record) => record.id === r.id ? updatedRecord : record));
    syncVehicleStatus(updatedRecord);
  };

  const syncVehicleStatus = (record: MaintenanceRecord) => {
    setVehicles((prevVehicles) => {
      return prevVehicles.map((v) => {
        if (v.id === record.vehicleId) {
          if (record.status === 'in_progress') return { ...v, status: 'maintenance' };
          if (record.status === 'completed') return { ...v, status: 'active' };
        }
        return v;
      });
    });
  };

  // ── Derived Data ──────────────────────────────────────────────────
  const { paginated, total } = useMemo(() => {
    let result = [...records];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((r) => {
        const v = vehicles.find((v) => v.id === r.vehicleId);
        return (
          r.id.toLowerCase().includes(q) ||
          v?.plateNumber.toLowerCase().includes(q) ||
          r.technicianName?.toLowerCase().includes(q)
        );
      });
    }

    if (filters.status) result = result.filter((r) => r.status === filters.status);
    if (filters.type) result = result.filter((r) => r.type === filters.type);
    if (filters.priority) result = result.filter((r) => r.priority === filters.priority);
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      result = result.filter((r) => new Date(r.scheduledDate).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      result = result.filter((r) => new Date(r.scheduledDate).getTime() <= end + 86400000);
    }

    result.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
    const pag = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return { paginated: pag, total: result.length };
  }, [records, vehicles, filters, page]);

  useEffect(() => {
    const maxPage = Math.ceil(total / PAGE_SIZE);
    if (page > maxPage && maxPage > 0) setPage(maxPage);
  }, [total, page]);

  const now = new Date().getTime();
  const metrics = {
    inService: vehicles.filter(v => v.status === 'maintenance').length,
    scheduled: records.filter(r => r.status === 'scheduled').length,
    overdue: records.filter(r => r.status === 'scheduled' && new Date(r.scheduledDate).getTime() < now).length,
    totalCost: records.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  // ── Columns ───────────────────────────────────────────────────────
  const columns: ColumnDef<MaintenanceRecord>[] = [
    {
      key: 'id',
      header: 'ID',
      accessor: (r) => <span className="font-mono text-[11px] font-medium text-slate-300">#{r.id.replace('maint_', '').toUpperCase()}</span>,
    },
    {
      key: 'vehicle',
      header: 'Vehicle & Reg',
      accessor: (r) => {
        const v = vehicles.find((v) => v.id === r.vehicleId);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-200">{v ? `${v.make} ${v.model}` : 'Unknown'}</span>
            <span className="text-[10px] text-slate-400 font-mono">{v?.plateNumber ?? r.vehicleId}</span>
          </div>
        );
      },
    },
    {
      key: 'service',
      header: 'Service Type',
      accessor: (r) => (
        <div className="flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-xs text-slate-300">{humaniseKey(r.type)}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      accessor: (r) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(r.priority)}`}>
          {r.priority}
        </span>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      accessor: (r) => {
        const isOverdue = r.status === 'scheduled' && new Date(r.scheduledDate).getTime() < now;
        return (
          <div className="flex flex-col gap-1">
            <span className={`text-[11px] ${isOverdue ? 'text-red-400 font-medium' : 'text-slate-300'}`}>Sch: {formatDateTime(r.scheduledDate).split(',')[0]}</span>
            <span className="text-[10px] text-slate-500">{r.completedDate ? `Cmp: ${formatDateTime(r.completedDate).split(',')[0]}` : 'Cmp: Pending'}</span>
          </div>
        );
      },
    },
    {
      key: 'cost',
      header: 'Cost',
      align: 'right',
      accessor: (r) => {
        const cost = r.actualCost !== null ? r.actualCost : r.estimatedCost;
        return (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs font-medium text-slate-200">{cost !== null ? `$${cost.toFixed(2)}` : 'N/A'}</span>
            <span className="text-[10px] text-slate-500">{r.actualCost !== null ? 'Actual' : 'Est.'}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (r) => {
        const canComplete = r.status === 'scheduled' || r.status === 'in_progress';
        return (
          <div className="flex items-center justify-end gap-1">
            {canComplete && (
              <button onClick={() => handleMarkCompleted(r)} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors" title="Mark Completed">
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
            <div className="w-px h-4 bg-slate-700/50 mx-1" />
            <button onClick={() => handleOpenDetails(r)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors" title="View Details">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => handleOpenEdit(r)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Record">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => handleOpenDelete(r)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors" title="Delete Record">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageTitle
        title="Maintenance Management"
        subtitle="Manage fleet service schedules, repairs, and vehicle statuses"
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Maintenance' }]}
        actions={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Schedule Service
          </button>
        }
      />

      {/* KPI Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Vehicles in Service" value={metrics.inService} color="text-amber-400" />
        <MetricCard label="Scheduled Services" value={metrics.scheduled} color="text-blue-400" />
        <MetricCard label="Overdue Services" value={metrics.overdue} color="text-red-400" />
        <MetricCard label="Total Cost (Completed)" value={`$${metrics.totalCost.toLocaleString()}`} color="text-emerald-400" />
      </div>

      <MaintenanceFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={() => setFilters({ search: '', status: '', type: '', priority: '', startDate: '', endDate: '' })}
      />

      <DataTable<MaintenanceRecord>
        columns={columns}
        data={paginated}
        keyExtractor={(r) => r.id}
        emptyTitle="No maintenance records found"
        emptyDescription="Try adjusting your filters or search query."
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />

      {/* Modals */}
      <MaintenanceDetailsModal open={detailsOpen} onOpenChange={setDetailsOpen} record={selectedRecord} />
      <MaintenanceFormModal open={formOpen} onOpenChange={setFormOpen} initialData={selectedRecord} onSave={handleSaveForm} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Record"
        description={`Are you sure you want to delete maintenance record #${selectedRecord?.id.replace('maint_', '').toUpperCase()}?`}
        confirmText="Delete"
        destructive={true}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-4 shadow-sm flex flex-col justify-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs font-medium text-slate-400 mt-1">{label}</p>
    </div>
  );
}
