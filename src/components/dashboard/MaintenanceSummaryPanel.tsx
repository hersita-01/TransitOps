import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, Wrench } from 'lucide-react';
import { cn } from '@/utils';
import { formatDate } from '@/utils';
import type { UpcomingMaintenance } from '@/mock/dashboard';

interface MaintenanceSummaryPanelProps {
  upcoming: UpcomingMaintenance[];
  completedThisMonth: number;
  inProgress: number;
}

const STATUS_CONFIG = {
  pending: {
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    label: 'Pending',
  },
  overdue: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    label: 'Overdue',
  },
  in_progress: {
    icon: <Wrench className="w-3.5 h-3.5" />,
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    label: 'In Shop',
  },
} as const;

export function MaintenanceSummaryPanel({
  upcoming,
  completedThisMonth,
  inProgress,
}: MaintenanceSummaryPanelProps): React.JSX.Element {
  return (
    <div>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-slate-700/40">
        {[
          { label: 'Upcoming',          value: upcoming.filter((u) => u.status === 'pending').length,  color: 'text-amber-400' },
          { label: 'Vehicles In Shop',  value: inProgress,          color: 'text-blue-400' },
          { label: 'Completed (Month)', value: completedThisMonth,  color: 'text-emerald-400' },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className={cn('text-2xl font-bold', item.color)}>{item.value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming list */}
      <div className="divide-y divide-slate-700/30">
        {upcoming.map((item) => {
          const cfg = STATUS_CONFIG[item.status];
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 px-5 py-3 hover:bg-slate-700/20 transition-colors"
            >
              <div
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5 border',
                  cfg.bg,
                  cfg.text,
                  cfg.border
                )}
              >
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-200 font-mono">{item.vehiclePlate}</span>
                  <span
                    className={cn(
                      'text-[10px] font-medium px-1.5 py-0.5 rounded border',
                      cfg.bg, cfg.text, cfg.border
                    )}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{item.vehicleName} · {item.type}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Due: {formatDate(item.dueDate)}</p>
              </div>
            </div>
          );
        })}

        {/* Completed strip */}
        <div className="px-5 py-3 flex items-center gap-2.5 bg-emerald-500/5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-400 font-medium">
            {completedThisMonth} service{completedThisMonth !== 1 ? 's' : ''} completed this month
          </p>
        </div>
      </div>
    </div>
  );
}
