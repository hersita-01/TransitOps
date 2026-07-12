import React from 'react';
import {
  Bus,
  Users,
  Route,
  Gauge,
  Fuel,
  Wrench,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { PageTitle } from '@/components/common/PageTitle';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  MOCK_KPI_CARDS,
  MOCK_TRIPS,
  MOCK_VEHICLES,
  MOCK_DRIVERS,
  MOCK_TRIP_ANALYTICS,
  MOCK_FUEL_SUMMARY,
  MOCK_FLEET_STATUS,
} from '@/services/mockData';
import { formatDate, formatDateTime } from '@/utils';

// ── Icon map for KPI cards ────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  Bus:    <Bus className="w-5 h-5" />,
  Users:  <Users className="w-5 h-5" />,
  Route:  <Route className="w-5 h-5" />,
  Gauge:  <Gauge className="w-5 h-5" />,
  Fuel:   <Fuel className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
};

// ── Chart colors ─────────────────────────────────────────────

const FLEET_COLORS = {
  active:      '#10b981',
  idle:        '#f59e0b',
  maintenance: '#3b82f6',
  offline:     '#64748b',
};

// ── Component ────────────────────────────────────────────────

export function DashboardPage(): React.JSX.Element {
  const recentTrips = MOCK_TRIPS.slice(0, 5);
  const activeVehicles = MOCK_VEHICLES.filter((v) => v.status === 'active');
  const onDutyDrivers = MOCK_DRIVERS.filter((d) => d.status === 'on_trip' || d.status === 'available');

  const pieData = [
    { name: 'Active',      value: MOCK_FLEET_STATUS.active,      fill: FLEET_COLORS.active },
    { name: 'Idle',        value: MOCK_FLEET_STATUS.idle,        fill: FLEET_COLORS.idle },
    { name: 'Maintenance', value: MOCK_FLEET_STATUS.maintenance, fill: FLEET_COLORS.maintenance },
    { name: 'Offline',     value: MOCK_FLEET_STATUS.offline,     fill: FLEET_COLORS.offline },
  ];

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle={`Good morning, Alex — here's your fleet overview for ${formatDate(new Date().toISOString())}`}
        breadcrumb={[{ label: 'TransitOps' }, { label: 'Dashboard' }]}
      />

      {/* ── KPI Cards ────────────────────────────────────────── */}
      <section aria-label="Key performance indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {MOCK_KPI_CARDS.map((card) => (
          <StatCard
            key={card.id}
            card={card}
            icon={ICON_MAP[card.icon] ?? <Gauge className="w-5 h-5" />}
          />
        ))}
      </section>

      {/* ── Main charts row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Trip Volume Chart */}
        <div className="xl:col-span-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Weekly Trip Volume</h2>
              <p className="text-xs text-slate-400 mt-0.5">Trips and distance over the past 7 days</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-medium">
              This Week
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_TRIP_ANALYTICS.weeklyData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tripGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', fontSize: '12px', color: '#f1f5f9' }}
                cursor={{ stroke: '#334155' }}
              />
              <Area type="monotone" dataKey="trips" name="Trips" stroke="#3b82f6" strokeWidth={2} fill="url(#tripGradient)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="distance" name="Distance (km)" stroke="#a855f7" strokeWidth={2} fill="url(#distanceGradient)" dot={false} activeDot={{ r: 4, fill: '#a855f7' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Status Pie */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-slate-200">Fleet Status</h2>
            <p className="text-xs text-slate-400 mt-0.5">{MOCK_FLEET_STATUS.total} vehicles total</p>
          </div>
          <div className="flex justify-center">
            <PieChart width={160} height={160}>
              <Pie
                data={pieData}
                cx={80}
                cy={80}
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                  <span className="text-xs text-slate-400">{entry.name}</span>
                </div>
                <span className="text-xs font-semibold text-slate-200">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <div className="xl:col-span-2 rounded-2xl bg-slate-800/60 border border-slate-700/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
            <h2 className="text-sm font-semibold text-slate-200">Recent Trips</h2>
            <a href="/trips" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-slate-700/40">
            {recentTrips.map((trip) => {
              const driver = MOCK_DRIVERS.find((d) => d.id === trip.driverId);
              return (
                <div key={trip.id} className="px-5 py-3.5 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-slate-500">#{trip.id.toUpperCase()}</span>
                        <StatusBadge status={trip.status} />
                      </div>
                      <p className="text-sm text-slate-200 font-medium truncate">
                        {trip.origin} → {trip.destination}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {driver ? `${driver.firstName} ${driver.lastName}` : 'Unassigned'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(trip.scheduledStart)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-slate-200">{trip.distanceKm} km</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Fleet */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
            <h2 className="text-sm font-semibold text-slate-200">Active Fleet</h2>
            <a href="/fleet" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-slate-700/40">
            {activeVehicles.map((vehicle) => {
              const driver = MOCK_DRIVERS.find((d) => d.id === vehicle.driverId);
              return (
                <div key={vehicle.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-slate-200 font-mono">{vehicle.plateNumber}</span>
                    <StatusBadge status={vehicle.status} />
                  </div>
                  <p className="text-xs text-slate-400">{vehicle.make} {vehicle.model}</p>
                  {driver && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Driver: {driver.firstName} {driver.lastName}
                    </p>
                  )}
                  {/* Fuel bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="flex items-center gap-1"><Fuel className="w-2.5 h-2.5" /> Fuel</span>
                      <span>{vehicle.fuelLevel}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${vehicle.fuelLevel}%`,
                          backgroundColor: vehicle.fuelLevel > 50 ? '#10b981' : vehicle.fuelLevel > 25 ? '#f59e0b' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* On-duty drivers mini list */}
            <div className="px-5 py-3.5 border-t border-slate-700/60">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">On-Duty Drivers</p>
              {onDutyDrivers.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center gap-2 mb-2 last:mb-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                    {d.firstName[0]}{d.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300 font-medium truncate">{d.firstName} {d.lastName}</p>
                  </div>
                  <StatusBadge status={d.status} className="ml-auto shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Fuel summary strip ───────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Fuel (Month)', value: `${MOCK_FUEL_SUMMARY.totalLiters.toLocaleString()} L`, sub: 'Across all vehicles' },
          { label: 'Fuel Cost (Month)',  value: `$${MOCK_FUEL_SUMMARY.totalCostUsd.toLocaleString()}`, sub: 'USD' },
          { label: 'Avg Efficiency',    value: `${MOCK_FUEL_SUMMARY.avgEfficiencyKmPerLiter} km/L`, sub: 'Fleet average' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-800/40 border border-slate-700/50 px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
              <Fuel className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
              <p className="text-lg font-bold text-slate-100">{item.value}</p>
              <p className="text-[10px] text-slate-500">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
