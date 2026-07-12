import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils';
import type { KPICard } from '@/types';
import { AnimatedWrapper } from '@/components/animations/AnimatedWrapper';
import { CountUpStat } from '@/components/animations/CountUpStat';

// ── Color map ────────────────────────────────────────────────

const COLOR_STYLES = {
  blue:   {
    icon: 'bg-blue-500/15 text-blue-400',
    glow: 'rgba(59,130,246,0.12)',
    accent: 'rgba(59,130,246,0.2)',
  },
  green:  {
    icon: 'bg-emerald-500/15 text-emerald-400',
    glow: 'rgba(16,185,129,0.12)',
    accent: 'rgba(16,185,129,0.2)',
  },
  amber:  {
    icon: 'bg-amber-500/15 text-amber-400',
    glow: 'rgba(245,158,11,0.10)',
    accent: 'rgba(245,158,11,0.18)',
  },
  red:    {
    icon: 'bg-red-500/15 text-red-400',
    glow: 'rgba(239,68,68,0.10)',
    accent: 'rgba(239,68,68,0.18)',
  },
  purple: {
    icon: 'bg-purple-500/15 text-purple-400',
    glow: 'rgba(139,92,246,0.12)',
    accent: 'rgba(139,92,246,0.2)',
  },
  cyan:   {
    icon: 'bg-cyan-500/15 text-cyan-400',
    glow: 'rgba(34,211,238,0.12)',
    accent: 'rgba(34,211,238,0.2)',
  },
} as const;

// ── Trend ────────────────────────────────────────────────────

function TrendIndicator({ direction, value }: { direction: KPICard['trend']; value: string }): React.JSX.Element {
  if (direction === 'up') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
        <TrendingUp className="w-3 h-3" />
        {value}
      </span>
    );
  }
  if (direction === 'down') {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-400">
        <TrendingDown className="w-3 h-3" />
        {value}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
      <Minus className="w-3 h-3" />
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
    <AnimatedWrapper>
      <article
        className={cn(
          'relative overflow-hidden rounded-2xl p-5 cursor-default card-lift',
          className
        )}
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-base)',
          boxShadow: 'var(--shadow-card)',
        }}
        aria-label={`${card.title}: ${card.value}${card.unit ? ' ' + card.unit : ''}`}
      >
        {/* Background accent glow — top-right corner */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)` }}
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4">
          {/* Icon container */}
          <div className={cn('flex items-center justify-center w-10 h-10 rounded-xl shrink-0', colors.icon)}>
            {icon}
          </div>

          {/* Trend pill */}
          <TrendIndicator direction={card.trend} value={card.trendValue} />
        </div>

        {/* Value + Label */}
        <div className="relative mt-4">
          <div className="flex items-baseline gap-1.5">
            <CountUpStat
              targetValue={card.value}
              className="text-2xl font-bold tabular-nums text-slate-100"
            />
            {card.unit && (
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{card.unit}</span>
            )}
          </div>
          <p
            className="mt-0.5 text-xs font-medium tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            {card.title}
          </p>
        </div>
      </article>
    </AnimatedWrapper>
  );
}
