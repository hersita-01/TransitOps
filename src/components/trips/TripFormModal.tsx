import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import type { Trip, Driver, Vehicle } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import { MOCK_DRIVERS } from '@/mock/drivers';

const tripSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  driverId: z.string().min(1, 'Driver is required'),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  cargoDescription: z.string().min(1, 'Cargo description is required'),
  cargoWeight: z.coerce.number().min(0, 'Weight must be a positive number'),
  distanceKm: z.coerce.number().min(0, 'Distance must be a positive number'),
  scheduledStart: z.string().min(1, 'Departure date is required'),
  scheduledEnd: z.string().min(1, 'Expected arrival date is required'),
  estimatedFuelLiters: z.coerce.number().min(0, 'Estimated fuel must be a positive number'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  notes: z.string().optional(),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Trip | null;
  onSave: (data: Partial<Trip>) => void;
}

export function TripFormModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: TripFormModalProps): React.JSX.Element {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: getEmptyForm(),
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          vehicleId: initialData.vehicleId,
          driverId: initialData.driverId,
          origin: initialData.origin,
          destination: initialData.destination,
          cargoDescription: initialData.cargoDescription || '',
          cargoWeight: initialData.cargoWeight || 0,
          distanceKm: initialData.distanceKm,
          scheduledStart: initialData.scheduledStart.slice(0, 16), // datetime-local format
          scheduledEnd: initialData.scheduledEnd.slice(0, 16),
          estimatedFuelLiters: initialData.estimatedFuelLiters || 0,
          priority: initialData.priority,
          notes: initialData.notes || '',
        });
      } else {
        reset(getEmptyForm());
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: TripFormData) => {
    onSave({
      ...data,
      scheduledStart: new Date(data.scheduledStart).toISOString(),
      scheduledEnd: new Date(data.scheduledEnd).toISOString(),
    });
  };

  const isVehicleUnavailable = (v: Vehicle) => {
    if (initialData?.vehicleId === v.id) return false;
    return v.status === 'active' || v.status === 'maintenance';
  };

  const isDriverUnavailable = (d: Driver) => {
    if (initialData?.driverId === d.id) return false;
    return d.status === 'on_trip' || d.status === 'suspended' || d.status === 'on_leave';
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Trip' : 'Schedule Trip'}
      description={isEditing ? 'Update trip details and assignment.' : 'Create a new trip and assign resources.'}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Row 1: Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
          <Field label="Assign Vehicle" error={errors.vehicleId?.message}>
            <select {...register('vehicleId')} className="input-field">
              <option value="">-- Select Vehicle --</option>
              {MOCK_VEHICLES.map((v) => {
                const disabled = isVehicleUnavailable(v);
                return (
                  <option key={v.id} value={v.id} disabled={disabled}>
                    {v.plateNumber} ({v.make} {v.model}) {disabled ? `- ${v.status.toUpperCase()}` : ''}
                  </option>
                );
              })}
            </select>
          </Field>
          <Field label="Assign Driver" error={errors.driverId?.message}>
            <select {...register('driverId')} className="input-field">
              <option value="">-- Select Driver --</option>
              {MOCK_DRIVERS.map((d) => {
                const disabled = isDriverUnavailable(d);
                return (
                  <option key={d.id} value={d.id} disabled={disabled}>
                    {d.firstName} {d.lastName} {disabled ? `- ${d.status.toUpperCase()}` : ''}
                  </option>
                );
              })}
            </select>
          </Field>
        </div>

        {/* Row 2: Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Origin" error={errors.origin?.message}>
            <input {...register('origin')} className="input-field" placeholder="e.g. Warehouse A" />
          </Field>
          <Field label="Destination" error={errors.destination?.message}>
            <input {...register('destination')} className="input-field" placeholder="e.g. Client Site B" />
          </Field>
        </div>

        {/* Row 3: Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Departure Date & Time" error={errors.scheduledStart?.message}>
            <input type="datetime-local" {...register('scheduledStart')} className="input-field" />
          </Field>
          <Field label="Expected Arrival Date & Time" error={errors.scheduledEnd?.message}>
            <input type="datetime-local" {...register('scheduledEnd')} className="input-field" />
          </Field>
        </div>

        {/* Row 4: Cargo & Distance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-700/50 pt-4">
          <div className="md:col-span-2">
            <Field label="Cargo Description" error={errors.cargoDescription?.message}>
              <input {...register('cargoDescription')} className="input-field" placeholder="e.g. Medical Supplies" />
            </Field>
          </div>
          <Field label="Cargo Weight (kg)" error={errors.cargoWeight?.message}>
            <input type="number" {...register('cargoWeight')} className="input-field" placeholder="0" />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Distance (km)" error={errors.distanceKm?.message}>
            <input type="number" step="0.1" {...register('distanceKm')} className="input-field" placeholder="0.0" />
          </Field>
          <Field label="Estimated Fuel (L)" error={errors.estimatedFuelLiters?.message}>
            <input type="number" step="0.1" {...register('estimatedFuelLiters')} className="input-field" placeholder="0.0" />
          </Field>
          <Field label="Priority" error={errors.priority?.message}>
            <select {...register('priority')} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </Field>
        </div>

        <Field label="Trip Notes (Optional)" error={errors.notes?.message}>
          <textarea {...register('notes')} className="input-field resize-none h-20" placeholder="Special instructions or notes..." />
        </Field>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6 sticky bottom-0 bg-slate-900 pb-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-colors disabled:opacity-50"
          >
            {isEditing ? 'Save Changes' : 'Schedule Trip'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-300">{label}</label>
      <div className="[&>.input-field]:w-full [&>.input-field]:px-3 [&>.input-field]:py-2 [&>.input-field]:bg-slate-900/50 [&>.input-field]:border [&>.input-field]:border-slate-700 [&>.input-field]:rounded-lg [&>.input-field]:text-sm [&>.input-field]:text-slate-200 [&>.input-field]:placeholder:text-slate-500 [&>.input-field]:focus:outline-none [&>.input-field]:focus:ring-2 [&>.input-field]:focus:ring-blue-500/50 [&>.input-field]:transition-all">
        {children}
      </div>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}

function getEmptyForm(): TripFormData {
  const now = new Date();
  const tmr = new Date();
  tmr.setHours(now.getHours() + 2);
  
  // Format for datetime-local
  const tzOffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
  const localNow = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  const localTmr = new Date(tmr.getTime() - tzOffset).toISOString().slice(0, 16);

  return {
    vehicleId: '',
    driverId: '',
    origin: '',
    destination: '',
    cargoDescription: '',
    cargoWeight: 0,
    distanceKm: 0,
    scheduledStart: localNow,
    scheduledEnd: localTmr,
    estimatedFuelLiters: 0,
    priority: 'medium',
    notes: '',
  };
}
