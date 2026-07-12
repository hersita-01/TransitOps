import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import type { Driver } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';

// ── Validation Schema ────────────────────────────────────────

const driverSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  licenseCategory: z.string().min(1, 'License category is required'),
  licenseExpiry: z.string().min(1, 'License expiry is required'),
  experienceYears: z.coerce.number().min(0, 'Experience must be 0 or more'),
  emergencyContact: z.string().min(1, 'Emergency contact is required'),
  medicalFitnessStatus: z.enum(['fit', 'unfit', 'pending']),
  status: z.enum(['available', 'on_trip', 'on_leave', 'inactive', 'suspended']),
  joinedAt: z.string().min(1, 'Joining date is required'),
  vehicleId: z.string().nullable(),
});

type DriverFormData = z.infer<typeof driverSchema>;

// ── Component ────────────────────────────────────────────────

interface DriverFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Driver | null;
  onSave: (data: Partial<Driver>) => void;
}

export function DriverFormModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: DriverFormModalProps): React.JSX.Element {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: getEmptyForm(),
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          employeeId: initialData.employeeId,
          phone: initialData.phone,
          email: initialData.email,
          address: initialData.address,
          licenseNumber: initialData.licenseNumber,
          licenseCategory: initialData.licenseCategory,
          licenseExpiry: initialData.licenseExpiry,
          experienceYears: initialData.experienceYears,
          emergencyContact: initialData.emergencyContact,
          medicalFitnessStatus: initialData.medicalFitnessStatus,
          status: initialData.status,
          joinedAt: initialData.joinedAt.split('T')[0],
          vehicleId: initialData.vehicleId,
        });
      } else {
        reset(getEmptyForm());
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: DriverFormData) => {
    // Treat empty string vehicleId as null
    const finalData = {
      ...data,
      vehicleId: data.vehicleId === '' ? null : data.vehicleId,
    };
    onSave(finalData);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Driver' : 'Add Driver'}
      description={isEditing ? 'Update driver profile information.' : 'Onboard a new driver to the fleet.'}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="First Name" error={errors.firstName?.message}>
            <input {...register('firstName')} className="input-field" placeholder="e.g. John" />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <input {...register('lastName')} className="input-field" placeholder="e.g. Doe" />
          </Field>
          <Field label="Employee ID" error={errors.employeeId?.message}>
            <input {...register('employeeId')} className="input-field font-mono" placeholder="e.g. EMP-1001" />
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email Address" error={errors.email?.message}>
            <input type="email" {...register('email')} className="input-field" placeholder="john.doe@example.com" />
          </Field>
          <Field label="Phone Number" error={errors.phone?.message}>
            <input {...register('phone')} className="input-field" placeholder="+1-212-555-0199" />
          </Field>
        </div>
        
        <Field label="Home Address" error={errors.address?.message}>
          <input {...register('address')} className="input-field" placeholder="Full address" />
        </Field>

        <div className="border-t border-slate-700/50 my-4" />

        {/* Row 3 - License */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="License Number" error={errors.licenseNumber?.message}>
            <input {...register('licenseNumber')} className="input-field font-mono" placeholder="e.g. NY-DL-123456" />
          </Field>
          <Field label="License Category" error={errors.licenseCategory?.message}>
            <input {...register('licenseCategory')} className="input-field" placeholder="e.g. CDL-A" />
          </Field>
          <Field label="License Expiry" error={errors.licenseExpiry?.message}>
            <input type="date" {...register('licenseExpiry')} className="input-field" />
          </Field>
        </div>

        {/* Row 4 - Professional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Years of Experience" error={errors.experienceYears?.message}>
            <input type="number" {...register('experienceYears')} className="input-field" placeholder="e.g. 5" />
          </Field>
          <Field label="Medical Fitness" error={errors.medicalFitnessStatus?.message}>
            <select {...register('medicalFitnessStatus')} className="input-field">
              <option value="fit">Fit for Duty</option>
              <option value="unfit">Unfit</option>
              <option value="pending">Pending Check</option>
            </select>
          </Field>
          <Field label="Current Status" error={errors.status?.message}>
            <select {...register('status')} className="input-field">
              <option value="available">Available</option>
              <option value="on_trip">On Trip</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </Field>
        </div>
        
        {/* Row 5 - Assigment & Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Joining Date" error={errors.joinedAt?.message}>
            <input type="date" {...register('joinedAt')} className="input-field" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Emergency Contact" error={errors.emergencyContact?.message}>
              <input {...register('emergencyContact')} className="input-field" placeholder="Name and Phone Number" />
            </Field>
          </div>
        </div>
        
        {/* Optional Assign Vehicle inside form */}
        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 mt-2">
           <Field label="Assigned Vehicle (Optional)" error={errors.vehicleId?.message}>
            <select {...register('vehicleId')} className="input-field">
              <option value="">-- Unassigned --</option>
              {MOCK_VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>{v.plateNumber} ({v.model}) - {v.status}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Actions */}
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
            {isEditing ? 'Save Changes' : 'Add Driver'}
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
      <div className="[&>.input-field]:w-full [&>.input-field]:px-3 [&>.input-field]:py-2 [&>.input-field]:bg-slate-900/50 [&>.input-field]:border [&>.input-field]:border-slate-700 [&>.input-field]:rounded-lg [&>.input-field]:text-sm [&>.input-field]:text-slate-200 [&>.input-field]:placeholder:text-slate-500 [&>.input-field]:focus:outline-none [&>.input-field]:focus:ring-2 [&>.input-field]:focus:ring-blue-500/50 [&>.input-field]:transition-all">
        {children}
      </div>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}

function getEmptyForm(): DriverFormData {
  return {
    firstName: '',
    lastName: '',
    employeeId: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    licenseCategory: 'Standard',
    licenseExpiry: '',
    experienceYears: 0,
    emergencyContact: '',
    medicalFitnessStatus: 'fit',
    status: 'available',
    joinedAt: new Date().toISOString().split('T')[0],
    vehicleId: '',
  };
}
