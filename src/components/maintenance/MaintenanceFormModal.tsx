import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import type { MaintenanceRecord, Vehicle } from '@/types';
import { useVehicles } from '@/hooks/useVehicles';

const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  type: z.enum(['oil_change', 'tire_rotation', 'brake_service', 'engine_check', 'full_service', 'other']),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  technicianName: z.string().optional(),
  estimatedCost: z.coerce.number().min(0, 'Estimated cost must be positive').optional(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MaintenanceRecord | null;
  onSave: (data: Partial<MaintenanceRecord>) => void;
}

export function MaintenanceFormModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: MaintenanceFormModalProps): React.JSX.Element {
  const isEditing = !!initialData;
  const { vehicles } = useVehicles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: getEmptyForm(),
  });



  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          vehicleId: initialData.vehicleId,
          type: initialData.type,
          description: initialData.description,
          priority: initialData.priority,
          technicianName: initialData.technicianName || '',
          estimatedCost: initialData.estimatedCost || 0,
          scheduledDate: initialData.scheduledDate.slice(0, 10), // YYYY-MM-DD
          notes: initialData.notes || '',
          status: initialData.status,
        });
      } else {
        reset(getEmptyForm());
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: MaintenanceFormData) => {
    onSave({
      ...data,
      estimatedCost: typeof data.estimatedCost === 'number' && !isNaN(data.estimatedCost) ? data.estimatedCost : 0,
      scheduledDate: new Date(data.scheduledDate).toISOString(),
    });
  };

  const isVehicleUnavailable = (v: Vehicle) => {
    if (initialData?.vehicleId === v.id) return false;
    return v.status === 'offline';
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Maintenance' : 'Schedule Maintenance'}
      description={isEditing ? 'Update service details.' : 'Schedule a new vehicle service.'}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Vehicle" error={errors.vehicleId?.message}>
            <select {...register('vehicleId')} className="input-field" disabled={isEditing}>
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((v) => {
                const disabled = isVehicleUnavailable(v);
                return (
                  <option key={v.id} value={v.id} disabled={disabled}>
                    {v.plateNumber} ({v.make} {v.model})
                  </option>
                );
              })}
            </select>
          </Field>
          
          <Field label="Service Type" error={errors.type?.message}>
            <select {...register('type')} className="input-field">
              <option value="oil_change">Oil Change</option>
              <option value="tire_rotation">Tire Rotation</option>
              <option value="brake_service">Brake Service</option>
              <option value="engine_check">Engine Check</option>
              <option value="full_service">Full Service</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Priority" error={errors.priority?.message}>
            <select {...register('priority')} className="input-field">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </Field>

          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className="input-field">
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Assigned Mechanic" error={errors.technicianName?.message}>
            <input {...register('technicianName')} className="input-field" placeholder="e.g. John Doe" />
          </Field>
          
          <div className="grid grid-cols-2 gap-4">
            <Field label="Scheduled Date" error={errors.scheduledDate?.message}>
              <input type="date" {...register('scheduledDate')} className="input-field" />
            </Field>
            <Field label="Est. Cost (₹)" error={errors.estimatedCost?.message}>
              <input type="number" step="0.01" {...register('estimatedCost')} className="input-field" placeholder="0.00" />
            </Field>
          </div>
        </div>

        <Field label="Description" error={errors.description?.message}>
          <input {...register('description')} className="input-field" placeholder="Brief summary of service needed" />
        </Field>

        <Field label="Notes (Optional)" error={errors.notes?.message}>
          <textarea {...register('notes')} className="input-field resize-none h-20" placeholder="Additional instructions..." />
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
            {isEditing ? 'Save Changes' : 'Schedule Service'}
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

function getEmptyForm(): MaintenanceFormData {
  return {
    vehicleId: '',
    type: 'oil_change',
    description: '',
    priority: 'medium',
    technicianName: '',
    estimatedCost: 0,
    scheduledDate: new Date().toISOString().slice(0, 10),
    notes: '',
    status: 'scheduled',
  };
}
