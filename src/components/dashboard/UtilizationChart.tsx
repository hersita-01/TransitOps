import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { UtilizationDataPoint } from '@/types/dashboard';

interface UtilizationChartProps {
  data: UtilizationDataPoint[];
  height?: number;
}

const TOOLTIP_STYLE = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#f1f5f9',
};

export function UtilizationChart({
  data,
  height = 200,
}: UtilizationChartProps): React.JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ stroke: '#334155', strokeWidth: 1 }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Utilization']}
        />
        <Area
          type="monotone"
          dataKey="utilization"
          name="Utilization"
          stroke="#06b6d4"
          strokeWidth={2}
          fill="url(#utilizationGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#06b6d4', stroke: '#0f172a', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
