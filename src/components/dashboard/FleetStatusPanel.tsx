import React from 'react';
import { cn } from '@/utils';
import type { FleetStatusDisplayItem } from '@/types/dashboard';

interface FleetStatusPanelProps {
  items: FleetStatusDisplayItem[];
  total: number;
}

export function FleetStatusPanel({ items, total }: FleetStatusPanelProps): React.JSX.Element {
  return (
    <div className="px-5 py-4 space-y-3">
      {items.map((item) => {
        const pct = total > 0 ? (item.count / total) * 100 : 0;
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border',
                    item.color,
                    item.textColor,
                    item.borderColor
                  )}
                >
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">{item.count}</span>
                <span className="text-xs text-slate-500 w-9 text-right">{pct.toFixed(0)}%</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', item.color)}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Total row */}
      <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Total Fleet</span>
        <span className="text-sm font-bold text-slate-100">{total} vehicles</span>
      </div>
    </div>
  );
}
