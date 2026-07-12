import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils';
import type { KPICard } from '@/types';

// ── Color map ────────────────────────────────────────────────

const COLOR_STYLES = {
  blue:   { bg: 'bg-blue-500/10',   icon: 'bg-blue-500/20 text-blue-400',   ring: 'ring-blue-500/20' },
  green:  { bg: 'bg-emerald-500/10', icon: 'bg-emerald-500/20 text-emerald-400', ring: 'ring-emerald-500/20' },
  amber:  { bg: 'bg-amber-500/10',  icon: 'bg-amber-500/20 text-amber-400',  ring: 'ring-amber-500/20' },
  red:    { bg: 'bg-red-500/10',    icon: 'bg-red-500/20 text-red-400',      ring: 'ring-red-500/20' },
  purple: { bg: 'bg-purple-500/10', icon: 'bg-purple-500/20 text-purple-400', ring: 'ring-purple-500/20' },
  cyan:   { bg: 'bg-cyan-500/10',   icon: 'bg-cyan-500/20 text-cyan-400',    ring: 'ring-cyan-500/20' },
} as const;

// ── Trend ────────────────────────────────────────────────────

function TrendIndicator({ direction, value }: { direction: KPICard['trend']; value: string }): React.JSX.Element {
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400">
        <TrendingUp className="w-3.5 h-3.5" />
        {value}
      </span>
    );
  }
  if (direction === 'down') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-400">
        <TrendingDown className="w-3.5 h-3.5" />
        {value}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-slate-400">
      <Minus className="w-3.5 h-3.5" />
      {value}
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────

interface StatCardProps {
  card: KPICard;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({ card, icon, className }: StatCardProps): React.JSX.Element {
  const colors = COLOR_STYLES[card.color];

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-2xl p-5',
        'bg-slate-800/60 border border-slate-700/60',
        'hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-200',
        'group cursor-default',
        className
      )}
      aria-label={`${card.title}: ${card.value}${card.unit ? ' ' + card.unit : ''}`}
    >
      {/* Background accent glow */}
      <div
        className={cn(
          'absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30',
          colors.bg
        )}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        {/* Icon */}
        <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl shrink-0', colors.icon)}>
          {icon}
        </div>

        {/* Trend */}
        <TrendIndicator direction={card.trend} value={card.trendValue} />
      </div>

      {/* Value */}
      <div className="relative mt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-slate-100 tabular-nums">{card.value}</span>
          {card.unit && (
            <span className="text-sm font-medium text-slate-400">{card.unit}</span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-400 font-medium tracking-wide uppercase">{card.title}</p>
      </div>
    </article>
  );
}
