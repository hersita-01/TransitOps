import React from 'react';
import {
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import type { Expense } from '@/types';

interface ChartsProps {
  expenses: Expense[];
}

export function ExpenseCharts({ expenses }: ChartsProps): React.JSX.Element {
  
  // 1. Process data for Category Breakdown
  const categoryMap: Record<string, number> = {};
  expenses.forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amountUsd;
  });
  const categoryData = Object.keys(categoryMap).map(k => ({
    name: k.charAt(0).toUpperCase() + k.slice(1),
    value: categoryMap[k]
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#64748b'];

  // 2. Process data for Monthly Trends (last 6 months, using mock data it might just be the current month, but we'll group by DD-MM or just Month)
  // Our mock data is heavily skewed to the last 30 days. Let's group by week or just "date" if all in one month.
  // Actually, we'll group by Day (DD/MM) for the trend line, since it's only 30 days of data.
  const dateMap: Record<string, { fuel: number; maintenance: number; other: number; total: number }> = {};
  
  // Sort ascending for time series
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  sortedExpenses.forEach(e => {
    const d = new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dateMap[d]) dateMap[d] = { fuel: 0, maintenance: 0, other: 0, total: 0 };
    
    if (e.category === 'fuel') dateMap[d].fuel += e.amountUsd;
    else if (e.category === 'maintenance') dateMap[d].maintenance += e.amountUsd;
    else dateMap[d].other += e.amountUsd;
    
    dateMap[d].total += e.amountUsd;
  });

  const timeSeriesData = Object.keys(dateMap).map(date => ({
    date,
    ...dateMap[date]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-semibold text-slate-200 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
      
      {/* Chart 1: Expenses Over Time (Area Chart) */}
      <div className="xl:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-6">Daily Expense Breakdown (Last 30 Days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="fuel" name="Fuel" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFuel)" />
              <Area type="monotone" dataKey="maintenance" name="Maintenance" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMaint)" />
              <Area type="monotone" dataKey="other" name="Other" stroke="#10b981" fillOpacity={0.1} fill="#10b981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Category Breakdown (Pie Chart) */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Category Breakdown</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e2e8f0', fontSize: '12px' }}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}
