// ──────────────────────────────────────────────────────────────
// src/mock/dashboard.ts
// Indian Logistics Demo Dataset – TransitOps
// ──────────────────────────────────────────────────────────────

import type {
  KPICard,
  FleetStatusSummary,
  FuelSummary,
  MaintenanceSummary,
  TripAnalytics,
} from '@/types';
import type { ActivityFeedItem, UtilizationDataPoint } from '@/types/dashboard';

// ── KPI Cards ────────────────────────────────────────────────

export const DASHBOARD_KPI_CARDS: KPICard[] = [
  {
    id: 'kpi_total_vehicles',
    title: 'Total Vehicles',
    value: 10,
    unit: 'units',
    trend: 'up',
    trendValue: '+2 this month',
    icon: 'Bus',
    color: 'blue',
  },
  {
    id: 'kpi_active_trips',
    title: 'Active Trips',
    value: 7,
    unit: 'now',
    trend: 'up',
    trendValue: '+2 vs yesterday',
    icon: 'Route',
    color: 'green',
  },
  {
    id: 'kpi_available_drivers',
    title: 'Available Drivers',
    value: 2,
    unit: '/ 10 total',
    trend: 'neutral',
    trendValue: 'Stable capacity',
    icon: 'Users',
    color: 'purple',
  },
  {
    id: 'kpi_in_maintenance',
    title: 'In Maintenance',
    value: 1,
    unit: 'vehicle',
    trend: 'down',
    trendValue: '-1 this week',
    icon: 'Wrench',
    color: 'red',
  },
  {
    id: 'kpi_fuel_cost',
    title: 'Monthly Fuel Cost',
    value: '₹4,85,000',
    trend: 'down',
    trendValue: '-6.4% vs last month',
    icon: 'Fuel',
    color: 'amber',
  },
  {
    id: 'kpi_utilization',
    title: 'Fleet Utilization',
    value: '78.4',
    unit: '%',
    trend: 'up',
    trendValue: '+4.8% vs last week',
    icon: 'Gauge',
    color: 'cyan',
  },
];

// ── Fleet Status ─────────────────────────────────────────────

export const DASHBOARD_FLEET_STATUS: FleetStatusSummary = {
  active: 7,
  idle: 2,
  maintenance: 1,
  offline: 0,
  total: 10,
};

// ── Fleet Utilization (daily %, 14 days) ─────────────────────

export const UTILIZATION_DATA: UtilizationDataPoint[] = [
  { date: 'Jun 28', utilization: 68.0 },
  { date: 'Jun 29', utilization: 72.5 },
  { date: 'Jun 30', utilization: 75.0 },
  { date: 'Jul 1',  utilization: 78.0 },
  { date: 'Jul 2',  utilization: 82.0 },
  { date: 'Jul 3',  utilization: 45.0 },
  { date: 'Jul 4',  utilization: 38.0 },
  { date: 'Jul 5',  utilization: 80.0 },
  { date: 'Jul 6',  utilization: 85.0 },
  { date: 'Jul 7',  utilization: 76.0 },
  { date: 'Jul 8',  utilization: 79.0 },
  { date: 'Jul 9',  utilization: 81.0 },
  { date: 'Jul 10', utilization: 48.0 },
  { date: 'Jul 11', utilization: 78.4 },
];

// ── Monthly Fuel Cost ────────────────────────────────────────

export const DASHBOARD_FUEL_SUMMARY: FuelSummary = {
  totalLiters: 5120,
  totalCostUsd: 485000,
  avgEfficiencyKmPerLiter: 4.8,
  monthlyData: [
    { month: 'Jan', liters: 4800, costUsd: 456000 },
    { month: 'Feb', liters: 4650, costUsd: 441750 },
    { month: 'Mar', liters: 5200, costUsd: 494000 },
    { month: 'Apr', liters: 5100, costUsd: 484500 },
    { month: 'May', liters: 4950, costUsd: 470250 },
    { month: 'Jun', liters: 5300, costUsd: 503500 },
    { month: 'Jul', liters: 2450, costUsd: 232750 },
  ],
};

// ── Maintenance Summary ──────────────────────────────────────

export const DASHBOARD_MAINTENANCE_SUMMARY: MaintenanceSummary = {
  pending: 2,
  inProgress: 1,
  overdue: 0,
  completedThisMonth: 4,
  totalCostThisMonthUsd: 84500,
};

// ── Upcoming Maintenance ─────────────────────────────────────

export interface UpcomingMaintenance {
  id: string;
  vehiclePlate: string;
  vehicleName: string;
  type: string;
  dueDate: string;
  status: 'pending' | 'overdue' | 'in_progress';
}

export const UPCOMING_MAINTENANCE: UpcomingMaintenance[] = [
  {
    id: 'maint_001',
    vehiclePlate: 'HR-55-KL-7788',
    vehicleName: 'Ashok Leyland Ecomet',
    type: 'Full Service',
    dueDate: '2026-07-11',
    status: 'in_progress',
  },
  {
    id: 'maint_002',
    vehiclePlate: 'MH-04-AB-1234',
    vehicleName: 'Tata Prima 4928.S',
    type: 'Brake Service',
    dueDate: '2026-07-16',
    status: 'pending',
  },
  {
    id: 'maint_003',
    vehiclePlate: 'KA-03-HA-4567',
    vehicleName: 'Eicher Pro 2049',
    type: 'Tire Rotation',
    dueDate: '2026-07-18',
    status: 'pending',
  },
];

// ── Trip Analytics ───────────────────────────────────────────

export const DASHBOARD_TRIP_ANALYTICS: TripAnalytics = {
  totalTrips: 9,
  completed: 2,
  cancelled: 0,
  avgDurationMinutes: 320,
  totalDistanceKm: 2044,
  weeklyData: [
    { day: 'Mon', trips: 12, distance: 3400 },
    { day: 'Tue', trips: 11, distance: 3100 },
    { day: 'Wed', trips: 14, distance: 3950 },
    { day: 'Thu', trips: 10, distance: 2850 },
    { day: 'Fri', trips: 15, distance: 4400 },
    { day: 'Sat', trips: 8,  distance: 2100 },
    { day: 'Sun', trips: 4,  distance: 1100 },
  ],
};

// ── Activity Feed ────────────────────────────────────────────

export const ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act_001',
    type: 'trip_started',
    title: 'Trip Started',
    description: 'Rohit Sharma began trip TRP-001 · Mumbai → Pune Expressway Corridor',
    timestamp: '2026-07-12T06:15:00Z',
    entityId: 'trp_001',
  },
  {
    id: 'act_002',
    type: 'trip_started',
    title: 'Trip Started',
    description: 'Rajesh Verma dispatched on trip TRP-002 · Delhi → Jaipur Highway NH-48',
    timestamp: '2026-07-12T05:40:00Z',
    entityId: 'trp_002',
  },
  {
    id: 'act_003',
    type: 'trip_completed',
    title: 'Trip Completed',
    description: 'Amit Patil completed trip TRP-004 · Pune → Mumbai JNPT Port Terminal',
    timestamp: '2026-07-11T12:45:00Z',
    entityId: 'trp_004',
  },
  {
    id: 'act_004',
    type: 'maintenance_scheduled',
    title: 'Maintenance In Progress',
    description: 'Full service overhaul initiated for HR-55-KL-7788 (Ashok Leyland Ecomet)',
    timestamp: '2026-07-11T10:00:00Z',
    entityId: 'maint_001',
  },
  {
    id: 'act_005',
    type: 'vehicle_assigned',
    title: 'Vehicle Assigned',
    description: 'MH-01-PQ-5544 (Mahindra Treo Zor Electric) assigned to Deepak Joshi',
    timestamp: '2026-07-11T08:30:00Z',
    entityId: 'veh_009',
  },
  {
    id: 'act_006',
    type: 'trip_completed',
    title: 'Trip Completed',
    description: 'Karthik Nair completed trip TRP-005 · Chennai → Coimbatore NH-544',
    timestamp: '2026-07-11T03:50:00Z',
    entityId: 'trp_005',
  },
  {
    id: 'act_007',
    type: 'maintenance_completed',
    title: 'Maintenance Completed',
    description: 'Synthetic oil change completed for TN-09-XY-3322 (BharatBenz 1617R)',
    timestamp: '2026-07-05T16:30:00Z',
    entityId: 'maint_004',
  },
];
