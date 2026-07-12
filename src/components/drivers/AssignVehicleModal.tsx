import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Truck, AlertTriangle } from 'lucide-react';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import type { Driver, Vehicle } from '@/types';

interface AssignVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver | null;
  onAssign: (driverId: string, vehicleId: string | null) => void;
}

export function AssignVehicleModal({
  open,
  onOpenChange,
  driver,
  onAssign,
}: AssignVehicleModalProps): React.JSX.Element | null {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  useEffect(() => {
    if (open && driver) {
      setSelectedVehicle(driver.vehicleId || '');
    }
  }, [open, driver]);

  if (!driver) return null;

  const handleSave = () => {
    onAssign(driver.id, selectedVehicle === '' ? null : selectedVehicle);
    onOpenChange(false);
  };

  // We consider a vehicle unavailable if it's maintenance or already active
  const isVehicleUnavailable = (v: Vehicle) => {
    return v.status === 'maintenance' || v.status === 'active';
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Vehicle"
      description={`Select a vehicle to assign to ${driver.firstName} ${driver.lastName}.`}
      className="max-w-md"
    >
      <div className="mt-4 space-y-4">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Available Vehicles</label>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
            >
              <option value="">-- Unassigned --</option>
              {MOCK_VEHICLES.map((v) => {
                const unavailable = isVehicleUnavailable(v) && driver.vehicleId !== v.id;
                return (
                  <option key={v.id} value={v.id} disabled={unavailable}>
                    {v.plateNumber} ({v.model}) {unavailable ? ` - ${v.status.toUpperCase()}` : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-200/80">
            Vehicles marked as 'Active' (On Trip) or 'Maintenance' cannot be assigned until they return to 'Idle' status.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-colors"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </Modal>
  );
}
