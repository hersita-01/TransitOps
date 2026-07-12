// ──────────────────────────────────────────────────────────────
// TransitOps – Mock Data
// All data is static and separated from components.
// Ready to be replaced with real API calls.
// ──────────────────────────────────────────────────────────────

import type {
  KPICard,
  FleetStatusSummary,
  FuelSummary,
  MaintenanceSummary,
  TripAnalytics,
  User,
} from '@/types';

import { MOCK_VEHICLES } from '@/mock/vehicles';
import { MOCK_DRIVERS } from '@/mock/drivers';
import { MOCK_TRIPS } from '@/mock/trips';
import { MOCK_MAINTENANCE } from '@/mock/maintenance';
import { MOCK_EXPENSES } from '@/mock/expenses';

export { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_TRIPS, MOCK_MAINTENANCE, MOCK_EXPENSES };

// ── Current User ────────────────────────────────────────────

export const MOCK_CURRENT_USER: User = {
  id: 'usr_001',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@transitops.io',
  role: 'admin',
  avatar: null,
  lastLogin: '2025-07-11T08:30:00Z',
};

// ── Drivers ─────────────────────────────────────────────────

// ── Trips (Exported above) ──────────────────────────────────

// ── Maintenance Records ──────────────────────────────────────

// ── Maintenance Records & Expenses (Exported above) ──────────

// ── Dashboard KPI Cards ──────────────────────────────────────

export const MOCK_KPI_CARDS: KPICard[] = [
  {
    id: 'kpi_fleet',
    title: 'Active Vehicles',
    value: 3,
    unit: '/ 6',
    trend: 'up',
    trendValue: '+1 today',
    icon: 'Bus',
    color: 'blue',
  },
  {
    id: 'kpi_drivers',
    title: 'On-Duty Drivers',
    value: MOCK_DRIVERS.filter(d => d.status === 'on_trip').length,
    unit: `/ ${MOCK_DRIVERS.length}`,
    trend: 'neutral',
    trendValue: 'Same as yesterday',
    icon: 'Users',
    color: 'green',
  },
  {
    id: 'kpi_trips',
    title: "All Trips",
    value: MOCK_TRIPS.length,
    unit: 'trips',
    trend: 'up',
    trendValue: '+33% vs last week',
    icon: 'Route',
    color: 'purple',
  },
  {
    id: 'kpi_distance',
    title: 'Distance Today',
    value: '164.9',
    unit: 'km',
    trend: 'up',
    trendValue: '+12.3% vs yesterday',
    icon: 'Gauge',
    color: 'cyan',
  },
  {
    id: 'kpi_cost',
    title: 'Operational Cost',
    value: `$${(MOCK_EXPENSES.reduce((sum, exp) => sum + exp.amountUsd, 0) / 1000).toFixed(1)}k`,
    unit: 'this month',
    trend: 'down',
    trendValue: '-2.4% vs last month',
    icon: 'Wallet',
    color: 'amber',
  },
  {
    id: 'kpi_maint',
    title: 'Upcoming Maintenance',
    value: MOCK_MAINTENANCE.filter(m => m.status === 'scheduled').length,
    unit: 'pending',
    trend: 'up',
    trendValue: '+2 this week',
    icon: 'Wrench',
    color: 'red',
  },
];

// ── Fleet Status Summary ─────────────────────────────────────

export const MOCK_FLEET_STATUS: FleetStatusSummary = {
  active: 3,
  idle: 1,
  maintenance: 1,
  offline: 1,
  total: 6,
};

// ── Fuel Summary ────────────────────────────────────────────

export const MOCK_FUEL_SUMMARY: FuelSummary = {
  totalLiters: 4820,
  totalCostUsd: 7230,
  avgEfficiencyKmPerLiter: 8.4,
  monthlyData: [
    { month: 'Jan', liters: 680, costUsd: 952 },
    { month: 'Feb', liters: 620, costUsd: 868 },
    { month: 'Mar', liters: 750, costUsd: 1050 },
    { month: 'Apr', liters: 810, costUsd: 1134 },
    { month: 'May', liters: 720, costUsd: 1008 },
    { month: 'Jun', liters: 870, costUsd: 1218 },
    { month: 'Jul', liters: 370, costUsd: 518 }, // partial month
  ],
};

// ── Maintenance Summary ──────────────────────────────────────

export const MOCK_MAINTENANCE_SUMMARY: MaintenanceSummary = {
  pending: 1,
  inProgress: 1,
  overdue: 1,
  completedThisMonth: 2,
  totalCostThisMonthUsd: 425,
};

// ── Trip Analytics ───────────────────────────────────────────

export const MOCK_TRIP_ANALYTICS: TripAnalytics = {
  totalTrips: 48,
  completed: 38,
  cancelled: 4,
  avgDurationMinutes: 62,
  totalDistanceKm: 1840,
  weeklyData: [
    { day: 'Mon', trips: 8, distance: 320 },
    { day: 'Tue', trips: 7, distance: 275 },
    { day: 'Wed', trips: 9, distance: 380 },
    { day: 'Thu', trips: 6, distance: 240 },
    { day: 'Fri', trips: 10, distance: 420 },
    { day: 'Sat', trips: 5, distance: 130 },
    { day: 'Sun', trips: 3, distance: 75 },
  ],
};
