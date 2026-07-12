import React from 'react';
import type { TripStatus } from '@/types';
import { FileText, CalendarClock, Send, Navigation, CheckCircle2, XCircle } from 'lucide-react';

interface TripTimelineProps {
  status: TripStatus;
}

const STEPS = [
  { id: 'draft', label: 'Draft', icon: FileText },
  { id: 'scheduled', label: 'Scheduled', icon: CalendarClock },
  { id: 'dispatched', label: 'Dispatched', icon: Send },
  { id: 'in_progress', label: 'In Progress', icon: Navigation },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export function TripTimeline({ status }: TripTimelineProps): React.JSX.Element {
  const isCancelled = status === 'cancelled';
  
  const getStepIndex = (s: TripStatus) => {
    if (s === 'cancelled') return 5;
    return STEPS.findIndex(step => step.id === s);
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="flex flex-col space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
      {STEPS.map((step, index) => {
        const isPast = !isCancelled && index < currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;
        const isFuture = isCancelled || index > currentIndex;
        
        let colorClass = 'text-slate-500 bg-slate-800 border-slate-700';
        
        if (isPast) {
          colorClass = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
        } else if (isCurrent) {
          colorClass = 'text-blue-400 bg-blue-400/10 border-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.2)]';
        }
        
        // Handle cancelled override for the final step
        if (isCancelled && index === STEPS.length - 1) {
          step = { id: 'cancelled', label: 'Cancelled', icon: XCircle };
          colorClass = 'text-red-400 bg-red-400/10 border-red-400/50';
        }

        const Icon = step.icon;

        return (
          <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            
            {/* Label */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-sm font-semibold ${isCurrent || isPast ? 'text-slate-200' : 'text-slate-500'} ${isCancelled && index === STEPS.length - 1 ? 'text-red-400' : ''}`}>
                  {step.label}
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                {isPast ? 'Completed' : isCurrent ? 'Current Phase' : isFuture && !isCancelled ? 'Pending' : ''}
                {isCancelled && index === STEPS.length - 1 ? 'Trip aborted' : ''}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
