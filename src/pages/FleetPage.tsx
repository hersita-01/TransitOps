import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { FleetFilters, type FleetFilterState } from '@/components/fleet/FleetFilters';
import { VehicleDetailsModal } from '@/components/fleet/VehicleDetailsModal';
import { VehicleFormModal } from '@/components/fleet/VehicleFormModal';
import { useVehicles } from '@/hooks/useVehicles';
import { MOCK_DRIVERS } from '@/mock/drivers';
import { formatDate, getInitials } from '@/utils';
import type { Vehicle, SortState } from '@/types';

const INITIAL_FILTERS: FleetFilterState = {
  search: '',
  status: '',
  type: '',
  fuelType: '',
};

export function FleetPage(): React.JSX.Element {
  // ── State ──────────────────────────────────────────────────
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [filters, setFilters] = useState<FleetFilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortState>({ column: 'createdAt', direction: 'desc' });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // ── Handlers ───────────────────────────────────────────────

  const handleAdd = () => {
    setSelectedVehicle(null);
    setFormModalOpen(true);
  };

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormModalOpen(true);
  };

  const handleDeleteRequest = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedVehicle) {
      deleteVehicle(selectedVehicle.id);
    }
  };

  const handleSave = (data: Partial<Vehicle>) => {
    if (selectedVehicle) {
      // Edit
      updateVehicle(selectedVehicle.id, data);
    } else {
      // Add
      addVehicle(data);
    }
    setFormModalOpen(false);
  };

  // ── Derived Data (Filter -> Sort -> Paginate) ──────────────

  const filteredData = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.status && v.status !== filters.status) return false;
      if (filters.type && v.type !== filters.type) return false;
      if (filters.fuelType && v.fuelType !== filters.fuelType) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (
          !v.plateNumber.toLowerCase().includes(query) &&
          !v.model.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [vehicles, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      let valA: string | number | null = a[sort.column as keyof Vehicle] as string | number | null;
      let valB: string | number | null = b[sort.column as keyof Vehicle] as string | number | null;
      
      // Handle missing/null values
      if (valA == null) valA = '';
      if (valB == null) valB = '';

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }, [filteredData, sort]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  // Adjust page if it exceeds total pages after filtering
  useEffect(() => {
    const totalPages = Math.ceil(sortedData.length / pageSize);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [sortedData.length, page, pageSize]);

  // ── Columns ────────────────────────────────────────────────

  const columns: ColumnDef<Vehicle>[] = [
    {
      key: 'plateNumber',
      header: 'Registration',
      sortable: true,
      accessor: (v) => <span className="font-mono text-blue-400">{v.plateNumber}</span>,
    },
    {
      key: 'model',
      header: 'Model',
      sortable: true,
      accessor: (v) => (
        <div>
          <p className="text-slate-200 font-medium">{v.model}</p>
          <p className="text-[10px] text-slate-500">{v.make}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      accessor: (v) => <span className="capitalize">{v.type}</span>,
    },
    {
      key: 'driverId',
      header: 'Driver',
      accessor: (v) => {
        const d = MOCK_DRIVERS.find((drv) => drv.id === v.driverId);
        if (!d) return <span className="text-slate-500 text-xs italic">Unassigned</span>;
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300">
              {getInitials(d.firstName, d.lastName)}
            </div>
            <span className="text-xs text-slate-300">{d.firstName} {d.lastName}</span>
          </div>
        );
      },
    },
    {
      key: 'fuelType',
      header: 'Fuel',
      sortable: true,
      accessor: (v) => <span className="capitalize text-xs">{v.fuelType}</span>,
    },
    {
      key: 'capacity',
      header: 'Capacity',
      sortable: true,
      accessor: (v) => <span className="text-xs">{v.capacity}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      accessor: (v) => <StatusBadge status={v.status} />,
    },
    {
      key: 'lastServiceDate',
      header: 'Last Maint.',
      sortable: true,
      accessor: (v) => <span className="text-xs text-slate-400">{formatDate(v.lastServiceDate)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (v) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleView(v); }}
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(v); }}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors"
            title="Edit Vehicle"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteRequest(v); }}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageTitle
          title="Fleet Management"
          subtitle={`Manage your fleet of ${vehicles.length} vehicles`}
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Filters */}
      <FleetFilters
        filters={filters}
        onChange={(newFilters) => {
          setFilters(newFilters);
          setPage(1); // Reset to first page on filter change
        }}
        onReset={() => {
          setFilters(INITIAL_FILTERS);
          setPage(1);
        }}
      />

      {/* Table & Pagination */}
      <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-4">
        <DataTable<Vehicle>
          columns={columns}
          data={paginatedData}
          keyExtractor={(v) => v.id}
          sort={sort}
          onSort={setSort}
          emptyTitle="No vehicles found"
          emptyDescription="Try adjusting your search or filters."
        />
        
        <Pagination
          page={page}
          pageSize={pageSize}
          total={sortedData.length}
          onPageChange={setPage}
        />
      </div>

      {/* Modals */}
      <VehicleDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        vehicle={selectedVehicle}
      />

      <VehicleFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        initialData={selectedVehicle}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Vehicle"
        description={`Are you sure you want to delete vehicle ${selectedVehicle?.plateNumber}? This action cannot be undone.`}
        confirmText="Delete"
        destructive={true}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
