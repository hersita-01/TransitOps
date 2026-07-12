import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface FuelDataPoint {
  month: string;
  liters: number;
  costUsd: number;
}

interface FuelCostChartProps {
  data: FuelDataPoint[];
  height?: number;
}

const TOOLTIP_STYLE = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#f1f5f9',
};

export function FuelCostChart({ data, height = 200 }: FuelCostChartProps): React.JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}L`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v}`}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(51,65,85,0.3)' }}
          formatter={(value: number, name: string) =>
            name === 'Cost (USD)' ? [`$${value}`, name] : [`${value} L`, name]
          }
        />
        <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8', paddingTop: '12px' }} />
        <Bar
          yAxisId="left"
          dataKey="liters"
          name="Liters"
          fill="#f59e0b"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          opacity={0.85}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="costUsd"
          name="Cost (USD)"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3, fill: '#3b82f6' }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
