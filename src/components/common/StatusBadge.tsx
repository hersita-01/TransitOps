import React from 'react';
import { cn } from '@/utils';
import type { VehicleStatus, DriverStatus, TripStatus, MaintenanceStatus } from '@/types';

type BadgeStatus = VehicleStatus | DriverStatus | TripStatus | MaintenanceStatus | string;

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  // Vehicle
  active:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  idle:        'bg-amber-500/15 text-amber-400 border-amber-500/30',
  maintenance: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  offline:     'bg-slate-500/15 text-slate-400 border-slate-500/30',
  // Driver
  available:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  on_trip:     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  off_duty:    'bg-slate-500/15 text-slate-400 border-slate-500/30',
  suspended:   'bg-red-500/15 text-red-400 border-red-500/30',
  // Trip
  scheduled:   'bg-purple-500/15 text-purple-400 border-purple-500/30',
  in_progress: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled:   'bg-red-500/15 text-red-400 border-red-500/30',
  // Maintenance
  pending:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  in_progress_m:'bg-blue-500/15 text-blue-400 border-blue-500/30',
  overdue:     'bg-red-500/15 text-red-400 border-red-500/30',
};

const LABEL_MAP: Record<string, string> = {
  on_trip: 'On Trip',
  off_duty: 'Off Duty',
  in_progress: 'In Progress',
};

function getLabel(status: string): string {
  return LABEL_MAP[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.JSX.Element {
  const styles = STATUS_STYLES[status] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  const isPulsing = status === 'active' || status === 'in_progress';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles,
        className
      )}
    >
      {isPulsing ? (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-cyan-400" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {getLabel(status)}
    </span>
  );
}

