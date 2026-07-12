import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Key } from 'lucide-react';
import { PageTitle } from '@/components/common/PageTitle';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { useDrivers } from '@/hooks/useDrivers';
import { formatDate, getInitials } from '@/utils';
import type { Driver } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DriverFilters, type DriverFilterState } from '@/components/drivers/DriverFilters';
import { DriverDetailsModal } from '@/components/drivers/DriverDetailsModal';
import { DriverFormModal } from '@/components/drivers/DriverFormModal';
import { AssignVehicleModal } from '@/components/drivers/AssignVehicleModal';

export function DriversPage(): React.JSX.Element {
  // ── State ────────────────────────────────────────────────────────
  const { drivers, addDriver, updateDriver, deleteDriver } = useDrivers();
  const [filters, setFilters] = useState<DriverFilterState>({
    search: '',
    status: '',
    assignment: '',
    licenseStatus: '',
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Modals State ──────────────────────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleOpenDetails = (d: Driver) => { setSelectedDriver(d); setDetailsOpen(true); };
  const handleOpenEdit = (d: Driver) => { setSelectedDriver(d); setFormOpen(true); };
  const handleOpenAssign = (d: Driver) => { setSelectedDriver(d); setAssignOpen(true); };
  const handleOpenDelete = (d: Driver) => { setSelectedDriver(d); setDeleteOpen(true); };
  
  const handleCreate = () => { setSelectedDriver(null); setFormOpen(true); };

  const handleSaveForm = (data: Partial<Driver>) => {
    if (selectedDriver) {
      updateDriver(selectedDriver.id, data);
    } else {
      addDriver(data);
    }
    setFormOpen(false);
  };

  const handleAssignVehicle = (driverId: string, vehicleId: string | null) => {
    updateDriver(driverId, { vehicleId });
  };

  const handleDelete = () => {
    if (selectedDriver) {
      deleteDriver(selectedDriver.id);
      setDeleteOpen(false);
    }
  };

  // ── Derived Data ──────────────────────────────────────────────────
  const { paginated, total } = useMemo(() => {
    let result = [...drivers];

    // Filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.employeeId.toLowerCase().includes(q) ||
          d.licenseNumber.toLowerCase().includes(q)
      );
    }
    if (filters.status) {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters.assignment) {
      if (filters.assignment === 'assigned') result = result.filter((d) => !!d.vehicleId);
      if (filters.assignment === 'unassigned') result = result.filter((d) => !d.vehicleId);
    }
    if (filters.licenseStatus) {
      const now = new Date();
      const in30Days = new Date();
      in30Days.setDate(now.getDate() + 30);

      result = result.filter((d) => {
        const expiry = new Date(d.licenseExpiry);
        if (filters.licenseStatus === 'expired') return expiry < now;
        if (filters.licenseStatus === 'expiring') return expiry >= now && expiry <= in30Days;
        if (filters.licenseStatus === 'valid') return expiry > in30Days;
        return true;
      });
    }

    // Paginate
    const paginated = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return { paginated, total: result.length };
  }, [drivers, filters, page]);

  // Adjust page if we filter out current page
  useEffect(() => {
    const maxPage = Math.ceil(total / PAGE_SIZE);
    if (page > maxPage && maxPage > 0) setPage(maxPage);
  }, [total, page]);

  // ── Columns ───────────────────────────────────────────────────────
  const columns: ColumnDef<Driver>[] = [
    {
      key: 'driver',
      header: 'Driver',
      accessor: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {d.avatar ? <img src={d.avatar} alt="Driver" className="w-full h-full rounded-full object-cover" /> : getInitials(d.firstName, d.lastName)}
          </div>
          <div>
            <p className="text-slate-200 font-medium">{d.firstName} {d.lastName}</p>
            <p className="text-[10px] text-slate-400 font-mono">{d.employeeId}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'contact',
      header: 'Contact',
      accessor: (d) => (
        <div>
          <p className="text-xs text-slate-300">{d.phone}</p>
          <p className="text-[10px] text-slate-500">{d.email}</p>
        </div>
      ),
    },
    {
      key: 'license',
      header: 'License',
      accessor: (d) => {
        const isExpired = new Date(d.licenseExpiry) < new Date();
        return (
          <div>
            <p className="text-slate-300 font-mono text-xs">{d.licenseNumber}</p>
            <p className={`text-[10px] mt-0.5 ${isExpired ? 'text-red-400' : 'text-slate-500'}`}>
              Exp: {formatDate(d.licenseExpiry)}
            </p>
          </div>
        );
      }
    },
    {
      key: 'experienceYears',
      header: 'Exp',
      accessor: (d) => <span className="text-slate-300 text-xs">{d.experienceYears} yrs</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'vehicleId',
      header: 'Assigned Vehicle',
      accessor: (d) => {
        const v = MOCK_VEHICLES.find((v) => v.id === d.vehicleId);
        return v ? (
          <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">{v.plateNumber}</span>
        ) : (
          <span className="text-xs text-slate-500 italic">None</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (d) => <StatusBadge status={d.status} />,
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      accessor: (d) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => handleOpenDetails(d)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenAssign(d)} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors" title="Assign Vehicle">
            <Key className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenEdit(d)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors" title="Edit Driver">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleOpenDelete(d)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors" title="Delete Driver">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const metrics = {
    total: drivers.length,
    active: drivers.filter(d => d.status === 'available' || d.status === 'on_trip').length,
    onTrip: drivers.filter(d => d.status === 'on_trip').length,
  };

  return (
    <div>
      <PageTitle
        title="Driver Management"
        subtitle={`${metrics.total} Total Drivers · ${metrics.active} Active · ${metrics.onTrip} On Trip`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Drivers' }]}
        actions={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            Add Driver
          </button>
        }
      />

      <DriverFilters
        filters={filters}
        onChange={(f) => { setFilters(f); setPage(1); }}
        onReset={() => setFilters({ search: '', status: '', assignment: '', licenseStatus: '' })}
      />

      <DataTable<Driver>
        columns={columns}
        data={paginated}
        keyExtractor={(d) => d.id}
        emptyTitle="No drivers found"
        emptyDescription="Try adjusting your filters or search query."
      />

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
      />

      {/* Modals */}
      <DriverDetailsModal open={detailsOpen} onOpenChange={setDetailsOpen} driver={selectedDriver} />
      <DriverFormModal open={formOpen} onOpenChange={setFormOpen} initialData={selectedDriver} onSave={handleSaveForm} />
      <AssignVehicleModal open={assignOpen} onOpenChange={setAssignOpen} driver={selectedDriver} onAssign={handleAssignVehicle} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Driver"
        description={`Are you sure you want to remove ${selectedDriver?.firstName} ${selectedDriver?.lastName}? This action cannot be undone.`}
        confirmText="Delete Driver"
        destructive={true}
        onConfirm={handleDelete}
      />
    </div>
  );
}
