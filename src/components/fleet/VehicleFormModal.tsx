import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import type { Vehicle } from '@/types';
import { MOCK_DRIVERS } from '@/mock/drivers';

// ── Validation Schema ────────────────────────────────────────

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, 'Registration number is required'),
  make: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  type: z.enum(['bus', 'van', 'truck', 'sedan']),
  fuelType: z.enum(['diesel', 'electric', 'hybrid', 'gasoline']),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  status: z.enum(['active', 'idle', 'maintenance', 'offline']),
  driverId: z.string().nullable(),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  insuranceExpiry: z.string().min(1, 'Insurance expiry is required'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

// ── Component ────────────────────────────────────────────────

interface VehicleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Vehicle | null;
  onSave: (data: Partial<Vehicle>) => void;
}

export function VehicleFormModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: VehicleFormModalProps): React.JSX.Element {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: getEmptyForm(),
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          plateNumber: initialData.plateNumber,
          make: initialData.make,
          model: initialData.model,
          type: initialData.type,
          fuelType: initialData.fuelType,
          capacity: initialData.capacity,
          status: initialData.status,
          driverId: initialData.driverId,
          purchaseDate: initialData.purchaseDate ? initialData.purchaseDate.slice(0, 10) : '',
          insuranceExpiry: initialData.insuranceExpiry ? initialData.insuranceExpiry.slice(0, 10) : '',
        });
      } else {
        reset(getEmptyForm());
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: VehicleFormData) => {
    // Treat empty string driverId as null
    const finalData = {
      ...data,
      driverId: data.driverId === '' ? null : data.driverId,
    };
    onSave(finalData);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
      description={isEditing ? 'Update vehicle information.' : 'Register a new vehicle in the fleet.'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Registration / Plate Number" error={errors.plateNumber?.message}>
            <input {...register('plateNumber')} className="input-field" placeholder="e.g. TX-1234-A" />
          </Field>
          <Field label="Assigned Driver" error={errors.driverId?.message}>
            <select {...register('driverId')} className="input-field">
              <option value="">-- Unassigned --</option>
              {MOCK_DRIVERS.map((d) => (
                <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Manufacturer (Make)" error={errors.make?.message}>
            <input {...register('make')} className="input-field" placeholder="e.g. Mercedes-Benz" />
          </Field>
          <Field label="Model" error={errors.model?.message}>
            <input {...register('model')} className="input-field" placeholder="e.g. Sprinter 519" />
          </Field>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Vehicle Type" error={errors.type?.message}>
            <select {...register('type')} className="input-field">
              <option value="bus">Bus</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
              <option value="sedan">Sedan</option>
            </select>
          </Field>
          <Field label="Fuel Type" error={errors.fuelType?.message}>
            <select {...register('fuelType')} className="input-field">
              <option value="diesel">Diesel</option>
              <option value="gasoline">Gasoline</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </Field>
          <Field label="Capacity" error={errors.capacity?.message}>
            <input type="number" {...register('capacity')} className="input-field" placeholder="e.g. 15" />
          </Field>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className="input-field">
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </Field>
          <Field label="Purchase Date" error={errors.purchaseDate?.message}>
            <input type="date" {...register('purchaseDate')} className="input-field" />
          </Field>
          <Field label="Insurance Expiry" error={errors.insuranceExpiry?.message}>
            <input type="date" {...register('insuranceExpiry')} className="input-field" />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6">
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
            {isEditing ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Helpers ──────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-300">{label}</label>
      {/* We use a wrapper to inject tailwind utility classes onto inputs directly from this module, avoiding global css bloat */}
      <div className="[&>.input-field]:w-full [&>.input-field]:px-3 [&>.input-field]:py-2 [&>.input-field]:bg-slate-900/50 [&>.input-field]:border [&>.input-field]:border-slate-700 [&>.input-field]:rounded-lg [&>.input-field]:text-sm [&>.input-field]:text-slate-200 [&>.input-field]:placeholder:text-slate-500 [&>.input-field]:focus:outline-none [&>.input-field]:focus:ring-2 [&>.input-field]:focus:ring-blue-500/50 [&>.input-field]:transition-all">
        {children}
      </div>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}

function getEmptyForm(): VehicleFormData {
  return {
    plateNumber: '',
    make: '',
    model: '',
    type: 'van',
    fuelType: 'diesel',
    capacity: 0,
    status: 'idle',
    driverId: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    insuranceExpiry: '',
  };
}
