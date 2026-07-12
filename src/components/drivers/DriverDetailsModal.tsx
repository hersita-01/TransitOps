import React from 'react';
import { User, Phone, Mail, MapPin, CreditCard, Calendar, Activity, Truck, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate, getInitials } from '@/utils';
import type { Driver } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';

interface DriverDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver | null;
}

export function DriverDetailsModal({
  open,
  onOpenChange,
  driver,
}: DriverDetailsModalProps): React.JSX.Element | null {
  if (!driver) return null;

  const assignedVehicle = MOCK_VEHICLES.find((v) => v.id === driver.vehicleId);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Driver Profile"
      description={`Detailed profile for ${driver.firstName} ${driver.lastName}`}
      className="max-w-2xl"
    >
      <div className="mt-4 space-y-6">
        {/* Header / Avatar */}
        <div className="flex gap-5">
          <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-700/50 flex flex-col items-center justify-center shrink-0">
            {driver.avatar ? (
              <img src={driver.avatar} alt="Driver" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl text-slate-500 font-bold">
                {getInitials(driver.firstName, driver.lastName)}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-slate-100">{driver.firstName} {driver.lastName}</h3>
              <StatusBadge status={driver.status} />
            </div>
            <p className="text-sm font-mono text-blue-400 mb-1">{driver.employeeId}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {driver.experienceYears} Years Exp</span>
              <span>•</span>
              <span className="flex items-center gap-1">⭐ {driver.rating.toFixed(1)} Rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          
          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-700/50 pb-2">Contact Information</h4>
            <DetailItem icon={<Phone />} label="Phone Number" value={driver.phone} />
            <DetailItem icon={<Mail />} label="Email Address" value={driver.email} />
            <DetailItem icon={<MapPin />} label="Home Address" value={driver.address} />
            <DetailItem icon={<AlertCircle />} label="Emergency Contact" value={driver.emergencyContact} />
          </div>

          {/* Professional Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-700/50 pb-2">Professional Details</h4>
            <DetailItem icon={<CreditCard />} label="License Number" value={driver.licenseNumber} />
            <div className="grid grid-cols-2 gap-2">
              <DetailItem icon={<CreditCard />} label="Category" value={driver.licenseCategory} />
              <DetailItem icon={<Calendar />} label="Expiry Date" value={formatDate(driver.licenseExpiry)} />
            </div>
            <DetailItem
              icon={<Truck />}
              label="Assigned Vehicle"
              value={assignedVehicle ? `${assignedVehicle.plateNumber} (${assignedVehicle.model})` : 'Unassigned'}
              valueClass={assignedVehicle ? 'text-blue-400 font-mono text-xs' : 'text-slate-500 italic'}
            />
            <DetailItem
              icon={<Activity />}
              label="Medical Fitness"
              value={driver.medicalFitnessStatus.toUpperCase()}
              valueClass={
                driver.medicalFitnessStatus === 'fit' ? 'text-emerald-400' :
                driver.medicalFitnessStatus === 'unfit' ? 'text-red-400' : 'text-amber-400'
              }
            />
          </div>
        </div>
        
        {/* Stats footer */}
        <div className="grid grid-cols-3 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Trips</p>
            <p className="text-lg font-bold text-slate-200">{driver.totalTrips}</p>
          </div>
          <div className="border-x border-slate-700/50">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Distance</p>
            <p className="text-lg font-bold text-slate-200">{driver.totalDistance.toLocaleString()} km</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Joined At</p>
            <p className="text-sm font-medium text-slate-200 mt-1">{formatDate(driver.joinedAt)}</p>
          </div>
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
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
        <span className="[&>svg]:w-3 [&>svg]:h-3 [&>svg]:text-slate-500">{icon}</span>
        {label}
      </div>
      <p className={`text-sm text-slate-200 font-medium ${valueClass ?? ''}`}>{value}</p>
    </div>
  );
}
