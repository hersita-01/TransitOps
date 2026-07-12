import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { TripTimeline } from './TripTimeline';
import type { Trip } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import { MOCK_DRIVERS } from '@/mock/drivers';
import { formatDateTime, getInitials } from '@/utils';
import { MapPin, Navigation, Package, Fuel, AlertCircle, FileText, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface TripDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
}

export function TripDetailsModal({ open, onOpenChange, trip }: TripDetailsModalProps): React.JSX.Element | null {
  if (!trip) return null;

  const vehicle = MOCK_VEHICLES.find(v => v.id === trip.vehicleId);
  const driver = MOCK_DRIVERS.find(d => d.id === trip.driverId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Trip #${trip.id.replace('trp_', '').toUpperCase()}`}
      description="Comprehensive trip details and timeline."
      className="max-w-4xl"
    >
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Info */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <StatusBadge status={trip.status} />
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(trip.priority)}`}>
              {trip.priority} Priority
            </span>
            <div className="flex items-center gap-1.5 ml-auto text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Created {formatDateTime(trip.scheduledStart)}</span>
            </div>
          </div>

          {/* Route Section */}
          <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 relative">
            <div className="absolute left-[33px] top-[45px] bottom-[45px] w-0.5 bg-slate-700/50 border-dashed border-l-2 border-slate-700" />
            
            <div className="flex items-start gap-4 mb-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Origin / Departure</p>
                <p className="text-sm font-semibold text-slate-200">{trip.origin}</p>
                <p className="text-xs text-slate-500 mt-0.5">{trip.actualStart ? formatDateTime(trip.actualStart) : formatDateTime(trip.scheduledStart)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Destination / Arrival</p>
                <p className="text-sm font-semibold text-slate-200">{trip.destination}</p>
                <p className="text-xs text-slate-500 mt-0.5">{trip.actualEnd ? formatDateTime(trip.actualEnd) : `Expected: ${formatDateTime(trip.scheduledEnd)}`}</p>
              </div>
            </div>
          </div>

          {/* Assigned Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {driver ? getInitials(driver.firstName, driver.lastName) : '?'}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">Assigned Driver</p>
                {driver ? (
                  <>
                    <p className="text-sm font-semibold text-slate-200">{driver.firstName} {driver.lastName}</p>
                    <p className="text-xs text-slate-500 font-mono">{driver.employeeId} · {driver.phone}</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 italic">Unassigned</p>
                )}
              </div>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">Assigned Vehicle</p>
                {vehicle ? (
                  <>
                    <p className="text-sm font-semibold text-slate-200">{vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-slate-500 font-mono">{vehicle.plateNumber}</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500 italic">Unassigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Cargo & Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox icon={Package} label="Cargo Desc" value={trip.cargoDescription || 'None'} />
            <StatBox icon={AlertCircle} label="Weight" value={trip.cargoWeight ? `${trip.cargoWeight} kg` : 'N/A'} />
            <StatBox icon={Navigation} label="Distance" value={`${trip.distanceKm} km`} />
            <StatBox icon={Fuel} label="Est. Fuel" value={trip.estimatedFuelLiters ? `${trip.estimatedFuelLiters} L` : 'N/A'} />
          </div>

          {/* Notes */}
          {trip.notes && (
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex gap-3">
              <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Trip Notes</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{trip.notes}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Timeline */}
        <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Trip Lifecycle
          </h3>
          <TripTimeline status={trip.status} />
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
        <button
          onClick={() => onOpenChange(false)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

function StatBox({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-200 truncate" title={value}>{value}</p>
    </div>
  );
}
