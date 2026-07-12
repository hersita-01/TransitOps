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
  Settings2,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCcw,
} from 'lucide-react';
// PageTitle not needed — welcome header is custom-built
import { StatCard }     from '@/components/common/StatCard';
import { StatusBadge }  from '@/components/common/StatusBadge';
import { DataTable, type ColumnDef } from '@/components/common/DataTable';
import { Modal }        from '@/components/ui/Modal';
import { DashboardCard }           from '@/components/dashboard/DashboardCard';
import { UtilizationChart }        from '@/components/dashboard/UtilizationChart';
import { FuelCostChart }           from '@/components/dashboard/FuelCostChart';
import { ActivityFeed }            from '@/components/dashboard/ActivityFeed';
import { FleetStatusPanel }        from '@/components/dashboard/FleetStatusPanel';
import { MaintenanceSummaryPanel } from '@/components/dashboard/MaintenanceSummaryPanel';
import { useAuth }      from '@/context/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useDemo } from '@/context/DemoContext';
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
  const { dashboardConfig, setDashboardConfig } = usePreferences();
  const { resetDemoData } = useDemo();
  const [showCustomizeModal, setShowCustomizeModal] = React.useState(false);

  const isWidgetVisible = (id: string) => dashboardConfig.find(w => w.id === id)?.visible ?? true;
  const toggleWidget = (id: string) => {
    setDashboardConfig(dashboardConfig.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const recentTrips = MOCK_TRIPS.slice(0, 6);

  // Derive active alerts from Maintenance
  const activeAlerts = UPCOMING_MAINTENANCE.filter(m => m.status === 'overdue' || m.status === 'in_progress');

  return (
    <div className="space-y-6">

      {/* ── 1. Welcome Header ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      rounded-2xl px-6 py-5 relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, rgba(5,10,25,0.9) 0%, rgba(10,20,50,0.85) 50%, rgba(20,10,45,0.8) 100%)', border: '1px solid rgba(34,211,238,0.12)' }}>
        {/* Ambient accent */}
        <div className="absolute top-0 left-0 w-64 h-full opacity-30 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(34,211,238,0.15) 0%, transparent 60%)' }}
             aria-hidden />
        <div className="absolute top-0 right-0 w-48 h-full opacity-20 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(139,92,246,0.15) 0%, transparent 60%)' }}
             aria-hidden />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <Building2 className="w-3.5 h-3.5" style={{ color: 'var(--text-disabled)' }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-disabled)' }}
            >
              City Transit Authority
            </span>
          </div>
          <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {greeting},{' '}
            <span className="text-gradient-cyan">
              {user?.firstName ?? 'Admin'}
            </span>{' '}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Here's your fleet overview for today.
          </p>
        </div>
        <div className="relative flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-all duration-150 border btn-base"
            style={{ background: 'rgba(15,23,42,0.5)', borderColor: 'rgba(51,65,85,0.6)' }}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize</span>
          </button>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-slate-500 border"
               style={{ background: 'rgba(15,23,42,0.4)', borderColor: 'rgba(51,65,85,0.4)' }}>
            <CalendarDays className="w-3.5 h-3.5 text-cyan-600" />
            {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* ── Active Alerts Widget ────────────────────────────── */}
      {isWidgetVisible('active-alerts') && activeAlerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4"
             style={{ background: 'rgba(245,158,11,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-400 tracking-tight">Fleet Alerts ({activeAlerts.length})</h3>
              <p className="text-xs text-amber-600 mt-0.5">Vehicles requiring immediate attention.</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/maintenance'}
            className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
          >
            View Alerts
          </button>
        </div>
      )}

      {/* ── 2. KPI Cards ────────────────────────────────────── */}
      {isWidgetVisible('summary') && (
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
      )}

      {/* ── 3 + 5. Fleet Status & Utilization Chart ─────────── */}
      {isWidgetVisible('fleet-health') && (
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
      )}

      {/* ── 4. Recent Trips Table ───────────────────────────── */}
      {isWidgetVisible('recent-timeline') && (
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
      )}

      {/* ── 6 + 7 + 8. Charts & Panels ──────────────────────── */}
      {isWidgetVisible('recent-timeline') && (
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
      )}

      {/* ── Trip analytics strip ──────────────────────────── */}
      {isWidgetVisible('summary') && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips (Week)',  value: DASHBOARD_TRIP_ANALYTICS.totalTrips,         unit: 'trips',  color: 'text-cyan-400', glow: '0 0 20px rgba(34,211,238,0.15)' },
          { label: 'Completed',          value: DASHBOARD_TRIP_ANALYTICS.completed,           unit: 'trips',  color: 'text-emerald-400', glow: '0 0 20px rgba(16,185,129,0.15)' },
          { label: 'Cancelled',          value: DASHBOARD_TRIP_ANALYTICS.cancelled,           unit: 'trips',  color: 'text-red-400', glow: '0 0 20px rgba(239,68,68,0.1)' },
          { label: 'Total Distance',     value: DASHBOARD_TRIP_ANALYTICS.totalDistanceKm.toLocaleString(), unit: 'km', color: 'text-purple-400', glow: '0 0 20px rgba(139,92,246,0.15)' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-700/40 px-5 py-4 card-lift"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <p className={`text-2xl font-bold tabular-nums ${item.color}`} style={{ textShadow: item.glow }}>
              {item.value}
              <span className="text-sm font-medium text-slate-600 ml-1">{item.unit}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{item.label}</p>
          </div>
        ))}
      </div>
      )}

      {/* ── 8. Activity Feed ─────────────────────────────────── */}
      {isWidgetVisible('recent-timeline') && (
        <DashboardCard
        title="Activity Feed"
        subtitle="Recent system events across the platform"
      >
        <ActivityFeed items={ACTIVITY_FEED} maxHeight="400px" />
      </DashboardCard>
      )}

      {/* ── Customize Modal ──────────────────────────────────── */}
      <Modal
        open={showCustomizeModal}
        onOpenChange={setShowCustomizeModal}
        title="Customize Dashboard"
        description="Show or hide widgets to personalize your workspace."
      >
        <div className="space-y-2 mt-4">
          {dashboardConfig.map((widget) => (
            <div key={widget.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="text-sm font-medium text-slate-300 capitalize">{widget.id.replace('-', ' ')}</span>
              <button
                onClick={() => toggleWidget(widget.id)}
                className="p-1.5 rounded-md hover:bg-slate-700 transition-colors"
              >
                {widget.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-slate-700/50">
          <button
            onClick={resetDemoData}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Demo Data
          </button>
        </div>
      </Modal>

    </div>
  );
}
