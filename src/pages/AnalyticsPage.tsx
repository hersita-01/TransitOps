import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { PageTitle } from '@/components/common/PageTitle';
import { MOCK_TRIP_ANALYTICS, MOCK_FUEL_SUMMARY } from '@/services/mockData';

export function AnalyticsPage(): React.JSX.Element {
  const { weeklyData, totalTrips, completed, cancelled, avgDurationMinutes, totalDistanceKm } = MOCK_TRIP_ANALYTICS;

  return (
    <div>
      <PageTitle
        title="Analytics"
        subtitle="Performance metrics, trends and operational insights"
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Analytics' }]}
      />

      {/* ── KPI Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Trips',     value: totalTrips },
          { label: 'Completed',       value: completed },
          { label: 'Cancelled',       value: cancelled },
          { label: 'Avg Duration',    value: `${avgDurationMinutes} min` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-800/60 border border-slate-700/60 px-5 py-4">
            <p className="text-2xl font-bold text-slate-100">{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* ── Trip Volume Chart ─────────────────────────────────── */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">Weekly Trip Volume & Distance</h2>
        <p className="text-xs text-slate-400 mb-5">Total distance this week: {totalDistanceKm.toLocaleString()} km</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={weeklyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aTrips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="aDist" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', fontSize: '12px', color: '#f1f5f9' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '16px' }} />
            <Area type="monotone" dataKey="trips" name="Trips" stroke="#3b82f6" strokeWidth={2} fill="url(#aTrips)" dot={false} />
            <Area type="monotone" dataKey="distance" name="Distance (km)" stroke="#a855f7" strokeWidth={2} fill="url(#aDist)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Fuel Chart ───────────────────────────────────────── */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">Monthly Fuel Consumption</h2>
        <p className="text-xs text-slate-400 mb-5">Liters consumed and cost (USD) per month</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={MOCK_FUEL_SUMMARY.monthlyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', fontSize: '12px', color: '#f1f5f9' }} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '16px' }} />
            <Bar dataKey="liters" name="Liters" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="costUsd" name="Cost (USD)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
