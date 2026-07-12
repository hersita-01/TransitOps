import React from 'react';
import {
  Bus,
  Users,
  Route,
  Gauge,
  Fuel,
  Wrench,
  MapPin,
  Clock,
  CalendarDays,
  Building2,
} from 'lucide-react';
// PageTitle not needed — welcome header is custom-built
import { StatCard }     from '@/components/common/StatCard';
import { StatusBadge }  from '@/components/common/StatusBadge';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { DashboardCard }           from '@/components/dashboard/DashboardCard';
import { UtilizationChart }        from '@/components/dashboard/UtilizationChart';
import { FuelCostChart }           from '@/components/dashboard/FuelCostChart';
import { ActivityFeed }            from '@/components/dashboard/ActivityFeed';
import { FleetStatusPanel }        from '@/components/dashboard/FleetStatusPanel';
import { MaintenanceSummaryPanel } from '@/components/dashboard/MaintenanceSummaryPanel';
import { useAuth }      from '@/context/AuthContext';
import { formatDate, formatDateTime, getInitials } from '@/utils';
import { MOCK_VEHICLES }    from '@/mock/vehicles';
import { MOCK_DRIVERS }     from '@/mock/drivers';
import { MOCK_TRIPS }       from '@/mock/trips';
import {
  DASHBOARD_KPI_CARDS,
  DASHBOARD_FLEET_STATUS,
  UTILIZATION_DATA,
  DASHBOARD_FUEL_SUMMARY,
  DASHBOARD_MAINTENANCE_SUMMARY,
  DASHBOARD_TRIP_ANALYTICS,
  UPCOMING_MAINTENANCE,
  ACTIVITY_FEED,
} from '@/mock/dashboard';
import type { Trip } from '@/types';
import type { FleetStatusDisplayItem } from '@/types/dashboard';

// ── Icon map for KPI cards ────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  Bus:    <Bus    className="w-5 h-5" />,
  Users:  <Users  className="w-5 h-5" />,
  Route:  <Route  className="w-5 h-5" />,
  Gauge:  <Gauge  className="w-5 h-5" />,
  Fuel:   <Fuel   className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
};

// ── Fleet status display config ───────────────────────────────

const FLEET_STATUS_ITEMS: FleetStatusDisplayItem[] = [
  {
    label:       'Available',
    count:       DASHBOARD_FLEET_STATUS.idle,
    color:       'bg-emerald-500/15',
    textColor:   'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  {
    label:       'On Trip',
    count:       DASHBOARD_FLEET_STATUS.active,
    color:       'bg-blue-500/15',
    textColor:   'text-blue-400',
    borderColor: 'border-blue-500/30',
  },
  {
    label:       'Maintenance',
    count:       DASHBOARD_FLEET_STATUS.maintenance,
    color:       'bg-amber-500/15',
    textColor:   'text-amber-400',
    borderColor: 'border-amber-500/30',
  },
  {
    label:       'Retired',
    count:       DASHBOARD_FLEET_STATUS.offline,
    color:       'bg-slate-500/15',
    textColor:   'text-slate-400',
    borderColor: 'border-slate-500/30',
  },
];

// ── Recent trips table columns ────────────────────────────────

const TRIP_COLUMNS: ColumnDef<Trip>[] = [
  {
    key:    'id',
    header: 'Trip ID',
    accessor: (t) => (
      <span className="font-mono text-[11px] text-slate-400">
        #{t.id.replace('trp_', '').toUpperCase()}
      </span>
    ),
  },
  {
    key:    'driver',
    header: 'Driver',
    accessor: (t) => {
      const d = MOCK_DRIVERS.find((d) => d.id === t.driverId);
      if (!d) return <span className="text-slate-500 text-xs">—</span>;
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
            {getInitials(d.firstName, d.lastName)}
          </div>
          <span className="text-xs text-slate-300">{d.firstName} {d.lastName}</span>
        </div>
      );
    },
  },
  {
    key:    'vehicle',
    header: 'Vehicle',
    accessor: (t) => {
      const v = MOCK_VEHICLES.find((v) => v.id === t.vehicleId);
      return (
        <span className="text-xs font-mono text-slate-300">
          {v?.plateNumber ?? t.vehicleId}
        </span>
      );
    },
  },
  {
    key:    'origin',
    header: 'Origin',
    accessor: (t) => (
      <div className="flex items-center gap-1">
        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="text-xs text-slate-300 truncate max-w-[120px]">{t.origin}</span>
      </div>
    ),
  },
  {
    key:    'destination',
    header: 'Destination',
    accessor: (t) => (
      <div className="flex items-center gap-1">
        <MapPin className="w-3 h-3 text-red-400 shrink-0" />
        <span className="text-xs text-slate-300 truncate max-w-[120px]">{t.destination}</span>
      </div>
    ),
  },
  {
    key:    'status',
    header: 'Status',
    accessor: (t) => <StatusBadge status={t.status} />,
    sortable: true,
  },
  {
    key:    'date',
    header: 'Date',
    accessor: (t) => (
      <span className="flex items-center gap-1 text-[11px] text-slate-400">
        <Clock className="w-3 h-3" />
        {formatDateTime(t.scheduledStart)}
      </span>
    ),
    sortable: true,
  },
];

// ── Page Component ────────────────────────────────────────────

export function DashboardPage(): React.JSX.Element {
  const { user } = useAuth();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const recentTrips = MOCK_TRIPS.slice(0, 6);

  return (
    <div className="space-y-6">

      {/* ── 1. Welcome Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-800/60 to-violet-900/20
                      border border-slate-700/60 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              City Transit Authority
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-100">
            {greeting},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              {user?.firstName ?? 'Admin'}
            </span>{' '}
            👋
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Here's your fleet overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
            {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* ── 2. KPI Cards ────────────────────────────────────── */}
      <section aria-label="Key performance indicators">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {DASHBOARD_KPI_CARDS.map((card) => (
            <StatCard
              key={card.id}
              card={card}
              icon={ICON_MAP[card.icon] ?? <Gauge className="w-5 h-5" />}
            />
          ))}
        </div>
      </section>

      {/* ── 3 + 5. Fleet Status & Utilization Chart ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3. Fleet Status */}
        <DashboardCard
          title="Fleet Status"
          subtitle={`${DASHBOARD_FLEET_STATUS.total} vehicles registered`}
          action={{ label: 'View fleet', href: '/fleet' }}
        >
          <FleetStatusPanel
            items={FLEET_STATUS_ITEMS}
            total={DASHBOARD_FLEET_STATUS.total}
          />
        </DashboardCard>

        {/* 5. Fleet Utilization Chart */}
        <DashboardCard
          title="Fleet Utilization"
          subtitle="Last 14 days · percentage of active fleet"
          className="lg:col-span-2"
        >
          <div className="px-2 pt-4 pb-3">
            <UtilizationChart data={UTILIZATION_DATA} height={190} />
          </div>
        </DashboardCard>
      </div>

      {/* ── 4. Recent Trips Table ───────────────────────────── */}
      <DashboardCard
        title="Recent Trips"
        subtitle={`Showing ${recentTrips.length} of ${MOCK_TRIPS.length} trips`}
        action={{ label: 'View all trips', href: '/trips' }}
      >
        <div className="p-0">
          <DataTable<Trip>
            id="dashboard-trips-table"
            columns={TRIP_COLUMNS}
            data={recentTrips}
            keyExtractor={(t) => t.id}
            emptyTitle="No recent trips"
            emptyDescription="Trips will appear here once scheduled."
          />
        </div>
      </DashboardCard>

      {/* ── 6 + 7 + 8. Charts & Panels ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 6. Fuel Cost Chart */}
        <DashboardCard
          title="Monthly Fuel Cost"
          subtitle="Liters consumed vs USD spend"
          action={{ label: 'View expenses', href: '/expenses' }}
          className="lg:col-span-2"
        >
          <div className="px-2 pt-4 pb-3">
            <FuelCostChart
              data={DASHBOARD_FUEL_SUMMARY.monthlyData}
              height={200}
            />
          </div>
        </DashboardCard>

        {/* 7. Maintenance Summary */}
        <DashboardCard
          title="Maintenance"
          subtitle="Upcoming & in-progress"
          action={{ label: 'View all', href: '/maintenance' }}
        >
          <MaintenanceSummaryPanel
            upcoming={UPCOMING_MAINTENANCE}
            completedThisMonth={DASHBOARD_MAINTENANCE_SUMMARY.completedThisMonth}
            inProgress={DASHBOARD_MAINTENANCE_SUMMARY.inProgress}
          />
        </DashboardCard>
      </div>

      {/* ── Trip analytics strip ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips (Week)',  value: DASHBOARD_TRIP_ANALYTICS.totalTrips,         unit: 'trips',  color: 'text-blue-400' },
          { label: 'Completed',          value: DASHBOARD_TRIP_ANALYTICS.completed,           unit: 'trips',  color: 'text-emerald-400' },
          { label: 'Cancelled',          value: DASHBOARD_TRIP_ANALYTICS.cancelled,           unit: 'trips',  color: 'text-red-400' },
          { label: 'Total Distance',     value: DASHBOARD_TRIP_ANALYTICS.totalDistanceKm.toLocaleString(), unit: 'km', color: 'text-purple-400' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-slate-800/50 border border-slate-700/50 px-5 py-4"
          >
            <p className={`text-2xl font-bold ${item.color}`}>
              {item.value}
              <span className="text-sm font-medium text-slate-500 ml-1">{item.unit}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* ── 8. Activity Feed ─────────────────────────────────── */}
      <DashboardCard
        title="Activity Feed"
        subtitle="Recent system events across the platform"
      >
        <ActivityFeed items={ACTIVITY_FEED} maxHeight="400px" />
      </DashboardCard>

    </div>
  );
}
