import React from 'react';
import { Modal } from '@/components/ui/Modal';
import type { MaintenanceRecord } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import { formatDateTime } from '@/utils';
import { Wrench, Calendar, DollarSign, Settings, AlertTriangle, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

interface MaintenanceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: MaintenanceRecord | null;
}

export function MaintenanceDetailsModal({ open, onOpenChange, record }: MaintenanceDetailsModalProps): React.JSX.Element | null {
  if (!record) return null;

  const vehicle = MOCK_VEHICLES.find(v => v.id === record.vehicleId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Maintenance #${record.id.replace('maint_', '').toUpperCase()}`}
      description="Service record details and status."
      className="max-w-2xl"
    >
      <div className="mt-4 space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Header Info */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <StatusBadge status={record.status} />
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(record.priority)}`}>
            {record.priority} Priority
          </span>
          <div className="flex items-center gap-1.5 ml-auto text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Scheduled: {formatDateTime(record.scheduledDate).split(',')[0]}</span>
          </div>
        </div>

        {/* Vehicle & Mechanic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">Vehicle</p>
              {vehicle ? (
                <>
                  <p className="text-sm font-semibold text-slate-200">{vehicle.make} {vehicle.model}</p>
                  <p className="text-xs text-slate-500 font-mono">{vehicle.plateNumber}</p>
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">Unknown Vehicle</p>
              )}
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 border border-slate-700">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-0.5">Assigned Mechanic</p>
              <p className="text-sm font-semibold text-slate-200">{record.technicianName || 'Unassigned'}</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Service Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Service Type</p>
              <p className="text-sm text-slate-300 font-medium">{formatType(record.type)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Description</p>
              <p className="text-sm text-slate-300">{record.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 border-t border-slate-700/50 pt-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Parts Used</p>
              {record.partsUsed && record.partsUsed.length > 0 ? (
                <ul className="list-disc pl-4 text-sm text-slate-300">
                  {record.partsUsed.map((part, idx) => (
                    <li key={idx}>{part}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">None logged</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Completion Date</p>
              <p className="text-sm text-slate-300">
                {record.completedDate ? formatDateTime(record.completedDate) : 'Not completed yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/30 flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <DollarSign className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Estimated Cost</p>
              <p className="text-lg font-semibold text-slate-200">
                {record.estimatedCost !== null ? `$${record.estimatedCost.toFixed(2)}` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-700/30 flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Actual Cost</p>
              <p className="text-lg font-semibold text-emerald-400">
                {record.actualCost !== null ? `$${record.actualCost.toFixed(2)}` : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {record.notes && (
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex gap-3">
            <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Service Notes</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{record.notes}</p>
            </div>
          </div>
        )}

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
