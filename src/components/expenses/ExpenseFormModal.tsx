import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import type { Expense } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';

const expenseSchema = z.object({
  vehicleId: z.string().optional().nullable(),
  category: z.enum(['fuel', 'maintenance', 'insurance', 'tyres', 'repairs', 'tolls', 'permits', 'miscellaneous']),
  amountUsd: z.coerce.number().min(0.01, 'Amount must be greater than zero'),
  vendor: z.string().min(1, 'Vendor name is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['pending', 'approved', 'rejected']),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Expense | null;
  onSave: (data: Partial<Expense>) => void;
}

export function ExpenseFormModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ExpenseFormModalProps): React.JSX.Element {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: getEmptyForm(),
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          vehicleId: initialData.vehicleId,
          category: initialData.category,
          amountUsd: initialData.amountUsd,
          vendor: initialData.vendor || '',
          description: initialData.description,
          date: initialData.date.slice(0, 10),
          status: initialData.status,
        });
      } else {
        reset(getEmptyForm());
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (data: ExpenseFormData) => {
    onSave({
      ...data,
      vehicleId: data.vehicleId || null,
      date: new Date(data.date).toISOString(),
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Expense' : 'Log Expense'}
      description={isEditing ? 'Update existing expense record.' : 'Record a new operational expense.'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Category" error={errors.category?.message}>
            <select {...register('category')} className="input-field">
              <option value="fuel">Fuel</option>
              <option value="maintenance">Maintenance</option>
              <option value="insurance">Insurance</option>
              <option value="tyres">Tyres</option>
              <option value="repairs">Repairs</option>
              <option value="tolls">Tolls</option>
              <option value="permits">Permits</option>
              <option value="miscellaneous">Miscellaneous</option>
            </select>
          </Field>
          
          <Field label="Vehicle (Optional)" error={errors.vehicleId?.message}>
            <select {...register('vehicleId')} className="input-field">
              <option value="">-- No Vehicle --</option>
              {MOCK_VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>{v.plateNumber} ({v.make})</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Amount (USD)" error={errors.amountUsd?.message}>
            <input type="number" step="0.01" {...register('amountUsd')} className="input-field" placeholder="0.00" />
          </Field>
          
          <div className="md:col-span-2">
            <Field label="Vendor" error={errors.vendor?.message}>
              <input {...register('vendor')} className="input-field" placeholder="e.g. Shell, AutoZone" />
            </Field>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Date" error={errors.date?.message}>
            <input type="date" {...register('date')} className="input-field" />
          </Field>

          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className="input-field">
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </Field>
        </div>

        <Field label="Description" error={errors.description?.message}>
          <textarea {...register('description')} className="input-field resize-none h-20" placeholder="Details about this expense..." />
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
            {isEditing ? 'Save Changes' : 'Log Expense'}
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

function getEmptyForm(): ExpenseFormData {
  return {
    vehicleId: '',
    category: 'fuel',
    amountUsd: 0,
    vendor: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'pending',
  };
}
