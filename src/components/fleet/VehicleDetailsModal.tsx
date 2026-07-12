import React from 'react';
import { Truck, MapPin, User, Calendar, ShieldCheck, Wrench, Fuel, Users } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/utils';
import type { Vehicle } from '@/types';
import { MOCK_DRIVERS } from '@/mock/drivers';

interface VehicleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export function VehicleDetailsModal({
  open,
  onOpenChange,
  vehicle,
}: VehicleDetailsModalProps): React.JSX.Element | null {
  if (!vehicle) return null;

  const driver = MOCK_DRIVERS.find((d) => d.id === vehicle.driverId);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Vehicle Details"
      description={`Detailed information for ${vehicle.plateNumber}`}
    >
      <div className="mt-4 space-y-6">
        {/* Header / Image Placeholder */}
        <div className="flex gap-5">
          <div className="w-32 h-24 bg-slate-800 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center shrink-0">
            <Truck className="w-8 h-8 text-slate-500 mb-1" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              {vehicle.type}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-100">{vehicle.make} {vehicle.model}</h3>
              <StatusBadge status={vehicle.status} />
            </div>
            <p className="text-sm font-mono text-blue-400 mb-1">{vehicle.plateNumber}</p>
            <p className="text-xs text-slate-400">ID: {vehicle.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DetailItem icon={<Fuel />} label="Fuel Type" value={vehicle.fuelType} className="capitalize" />
          <DetailItem icon={<Users />} label="Capacity" value={`${vehicle.capacity} units`} />
          
          <DetailItem
            icon={<User />}
            label="Assigned Driver"
            value={driver ? `${driver.firstName} ${driver.lastName}` : 'Unassigned'}
            valueClass={driver ? 'text-slate-200' : 'text-slate-500 italic'}
          />
          <DetailItem
            icon={<MapPin />}
            label="Location"
            value={vehicle.location?.address ?? 'Unknown'}
          />
          
          <DetailItem
            icon={<Wrench />}
            label="Last Maintenance"
            value={formatDate(vehicle.lastServiceDate)}
          />
          <DetailItem
            icon={<ShieldCheck />}
            label="Insurance Expiry"
            value={formatDate(vehicle.insuranceExpiry)}
          />
          
          <DetailItem
            icon={<Calendar />}
            label="Purchase Date"
            value={formatDate(vehicle.purchaseDate)}
          />
          <DetailItem
            icon={<Calendar />}
            label="Next Service Due"
            value={formatDate(vehicle.nextServiceDue)}
          />
        </div>

        <div className="pt-4 border-t border-slate-700/50 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Helper ───────────────────────────────────────────────────

function DetailItem({
  icon,
  label,
  value,
  className,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  valueClass?: string;
}): React.JSX.Element {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-0.5">
        <span className="[&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:text-slate-500">{icon}</span>
        {label}
      </div>
      <p className={`text-sm text-slate-200 font-medium ${valueClass ?? ''}`}>{value}</p>
    </div>
  );
}
