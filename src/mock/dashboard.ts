// ──────────────────────────────────────────────────────────────
// src/mock/dashboard.ts
// Dashboard-specific mock data for TransitOps – FE-002
// KPI cards, fleet status, charts, maintenance, activity feed
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
    value: 8,
    unit: 'units',
    trend: 'up',
    trendValue: '+2 this month',
    icon: 'Bus',
    color: 'blue',
  },
  {
    id: 'kpi_active_trips',
    title: 'Active Trips',
    value: 3,
    unit: 'now',
    trend: 'up',
    trendValue: '+1 vs yesterday',
    icon: 'Route',
    color: 'green',
  },
  {
    id: 'kpi_available_drivers',
    title: 'Available Drivers',
    value: 2,
    unit: '/ 7 total',
    trend: 'down',
    trendValue: '-1 vs yesterday',
    icon: 'Users',
    color: 'purple',
  },
  {
    id: 'kpi_in_maintenance',
    title: 'In Maintenance',
    value: 2,
    unit: 'vehicles',
    trend: 'up',
    trendValue: '+1 this week',
    icon: 'Wrench',
    color: 'red',
  },
  {
    id: 'kpi_fuel_cost',
    title: 'Monthly Fuel Cost',
    value: '₹5,23,000',
    trend: 'down',
    trendValue: '-8.2% vs last month',
    icon: 'Fuel',
    color: 'amber',
  },
  {
    id: 'kpi_utilization',
    title: 'Fleet Utilization',
    value: '68.5',
    unit: '%',
    trend: 'up',
    trendValue: '+5.2% vs last week',
    icon: 'Gauge',
    color: 'cyan',
  },
];

// ── Fleet Status ─────────────────────────────────────────────

export const DASHBOARD_FLEET_STATUS: FleetStatusSummary = {
  active: 4,   // on trip
  idle: 1,     // available
  maintenance: 2,
  offline: 1,  // retired/offline
  total: 8,
};

// ── Fleet Utilization (daily %, 14 days) ─────────────────────

export const UTILIZATION_DATA: UtilizationDataPoint[] = [
  { date: 'Jun 28', utilization: 58.3 },
  { date: 'Jun 29', utilization: 62.5 },
  { date: 'Jun 30', utilization: 55.0 },
  { date: 'Jul 1',  utilization: 70.8 },
  { date: 'Jul 2',  utilization: 75.0 },
  { date: 'Jul 3',  utilization: 37.5 }, // weekend
  { date: 'Jul 4',  utilization: 25.0 }, // holiday
  { date: 'Jul 5',  utilization: 79.2 },
  { date: 'Jul 6',  utilization: 83.3 },
  { date: 'Jul 7',  utilization: 66.7 },
  { date: 'Jul 8',  utilization: 72.9 },
  { date: 'Jul 9',  utilization: 68.8 },
  { date: 'Jul 10', utilization: 41.7 }, // weekend
  { date: 'Jul 11', utilization: 68.5 }, // today
];

// ── Monthly Fuel Cost ────────────────────────────────────────

export const DASHBOARD_FUEL_SUMMARY: FuelSummary = {
  totalLiters: 4820,
  totalCostUsd: 7230,
  avgEfficiencyKmPerLiter: 8.4,
  monthlyData: [
    { month: 'Jan', liters: 680,  costUsd: 952  },
    { month: 'Feb', liters: 620,  costUsd: 868  },
    { month: 'Mar', liters: 750,  costUsd: 1050 },
    { month: 'Apr', liters: 810,  costUsd: 1134 },
    { month: 'May', liters: 720,  costUsd: 1008 },
    { month: 'Jun', liters: 870,  costUsd: 1218 },
    { month: 'Jul', liters: 370,  costUsd: 518  }, // partial month
  ],
};

// ── Maintenance Summary ──────────────────────────────────────

export const DASHBOARD_MAINTENANCE_SUMMARY: MaintenanceSummary = {
  pending: 1,
  inProgress: 1,
  overdue: 1,
  completedThisMonth: 3,
  totalCostThisMonthUsd: 1245,
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
    id: 'mnt_001',
    vehiclePlate: 'TX-5500-D',
    vehicleName: 'Toyota HiAce',
    type: 'Engine Check',
    dueDate: '2025-07-10',
    status: 'in_progress',
  },
  {
    id: 'mnt_002',
    vehiclePlate: 'TX-1144-F',
    vehicleName: 'Isuzu NPR HD',
    type: 'Full Service',
    dueDate: '2025-06-01',
    status: 'overdue',
  },
  {
    id: 'mnt_003',
    vehiclePlate: 'TX-3347-B',
    vehicleName: 'Ford Transit 350',
    type: 'Tire Rotation',
    dueDate: '2025-07-15',
    status: 'pending',
  },
  {
    id: 'mnt_004',
    vehiclePlate: 'TX-6632-H',
    vehicleName: 'Mercedes Atego',
    type: 'Brake Service',
    dueDate: '2025-07-01',
    status: 'overdue',
  },
];

// ── Trip Analytics ───────────────────────────────────────────

export const DASHBOARD_TRIP_ANALYTICS: TripAnalytics = {
  totalTrips: 8,
  completed: 3,
  cancelled: 1,
  avgDurationMinutes: 58,
  totalDistanceKm: 204.4,
  weeklyData: [
    { day: 'Mon', trips: 8,  distance: 320 },
    { day: 'Tue', trips: 7,  distance: 275 },
    { day: 'Wed', trips: 9,  distance: 380 },
    { day: 'Thu', trips: 6,  distance: 240 },
    { day: 'Fri', trips: 10, distance: 420 },
    { day: 'Sat', trips: 5,  distance: 130 },
    { day: 'Sun', trips: 3,  distance: 75  },
  ],
};

// ── Activity Feed ────────────────────────────────────────────

export const ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act_001',
    type: 'trip_completed',
    title: 'Trip Completed',
    description: 'James Carter completed trip TRP-004 · Grand Central → Stamford',
    timestamp: '2025-07-11T07:18:00Z',
    entityId: 'trp_004',
  },
  {
    id: 'act_002',
    type: 'trip_started',
    title: 'Trip Started',
    description: 'Maria Santos began trip TRP-002 · Penn Station → Newark Airport',
    timestamp: '2025-07-11T08:32:00Z',
    entityId: 'trp_002',
  },
  {
    id: 'act_003',
    type: 'maintenance_scheduled',
    title: 'Maintenance Scheduled',
    description: 'Tire rotation booked for TX-3347-B (Ford Transit) on Jul 15',
    timestamp: '2025-07-11T08:00:00Z',
    entityId: 'mnt_003',
  },
  {
    id: 'act_004',
    type: 'vehicle_assigned',
    title: 'Vehicle Assigned',
    description: 'TX-2288-G (MAN Lion\'s Coach) assigned to Sarah Thompson',
    timestamp: '2025-07-11T07:45:00Z',
    entityId: 'veh_007',
  },
  {
    id: 'act_005',
    type: 'driver_added',
    title: 'Driver Added',
    description: 'Elena Vasquez onboarded as a new dispatcher driver',
    timestamp: '2025-07-10T17:30:00Z',
    entityId: 'drv_006',
  },
  {
    id: 'act_006',
    type: 'trip_cancelled',
    title: 'Trip Cancelled',
    description: 'Trip TRP-006 cancelled · Wall Street → Long Island City (weather)',
    timestamp: '2025-07-10T14:00:00Z',
    entityId: 'trp_006',
  },
  {
    id: 'act_007',
    type: 'maintenance_completed',
    title: 'Maintenance Completed',
    description: 'Oil change completed on TX-4821-A (Mercedes Sprinter)',
    timestamp: '2025-07-10T12:00:00Z',
    entityId: 'mnt_004',
  },
  {
    id: 'act_008',
    type: 'trip_completed',
    title: 'Trip Completed',
    description: 'David Kim completed trip TRP-008 · Hudson Yards → Newark Penn',
    timestamp: '2025-07-10T08:08:00Z',
    entityId: 'trp_008',
  },
  {
    id: 'act_009',
    type: 'vehicle_assigned',
    title: 'Vehicle Assigned',
    description: 'TX-9001-E (Scania Interlink) assigned to David Kim for Route 3',
    timestamp: '2025-07-09T17:00:00Z',
    entityId: 'veh_005',
  },
  {
    id: 'act_010',
    type: 'maintenance_scheduled',
    title: 'Maintenance Alert',
    description: 'TX-1144-F (Isuzu NPR) overdue for full service — action required',
    timestamp: '2025-07-09T09:00:00Z',
    entityId: 'mnt_002',
  },
];
