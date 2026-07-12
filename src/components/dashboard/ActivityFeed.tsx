import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  Truck,
  UserPlus,
  CalendarClock,
  Wrench,
  Clock,
} from 'lucide-react';
import { cn } from '@/utils';
import { timeAgo } from '@/utils';
import type { ActivityFeedItem, ActivityEventType } from '@/types/dashboard';

// ── Icon & colour config ─────────────────────────────────────

interface EventConfig {
  icon: React.ReactNode;
  bg: string;
  text: string;
}

const EVENT_CONFIG: Record<ActivityEventType, EventConfig> = {
  trip_completed: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
  },
  trip_started: {
    icon: <Play className="w-3.5 h-3.5" />,
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
  },
  trip_cancelled: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-red-500/15',
    text: 'text-red-400',
  },
  vehicle_assigned: {
    icon: <Truck className="w-3.5 h-3.5" />,
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
  },
  driver_added: {
    icon: <UserPlus className="w-3.5 h-3.5" />,
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
  },
  maintenance_scheduled: {
    icon: <CalendarClock className="w-3.5 h-3.5" />,
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
  },
  maintenance_completed: {
    icon: <Wrench className="w-3.5 h-3.5" />,
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
  },
};

// ── Props ────────────────────────────────────────────────────

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  maxHeight?: string;
}

// ── Component ────────────────────────────────────────────────

export function ActivityFeed({ items, maxHeight = '360px' }: ActivityFeedProps): React.JSX.Element {
  return (
    <div
      className="overflow-y-auto divide-y divide-slate-700/40"
      style={{ maxHeight }}
      aria-label="Activity feed"
    >
      {items.map((item, index) => {
        const config = EVENT_CONFIG[item.type];
        return (
          <div
            key={item.id}
            className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-700/20 transition-colors"
          >
            {/* Timeline dot + line */}
            <div className="relative flex flex-col items-center shrink-0 mt-0.5">
              <div
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg shrink-0',
                  config.bg,
                  config.text
                )}
              >
                {config.icon}
              </div>
              {index < items.length - 1 && (
                <div className="w-px flex-1 bg-slate-700/50 mt-1.5 min-h-[16px]" aria-hidden />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                <span className="flex items-center gap-0.5 text-[10px] text-slate-500 shrink-0 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {timeAgo(item.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
