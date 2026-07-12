// ──────────────────────────────────────────────────────────────
// TransitOps – Mock Data
// All data is static and separated from components.
// Ready to be replaced with real API calls.
// ──────────────────────────────────────────────────────────────

import type {
  Trip,
  MaintenanceRecord,
  Expense,
  KPICard,
  FleetStatusSummary,
  FuelSummary,
  MaintenanceSummary,
  TripAnalytics,
  User,
} from '@/types';

import { MOCK_DRIVERS } from '@/mock/drivers';
import { MOCK_VEHICLES } from '@/mock/vehicles';

export { MOCK_VEHICLES, MOCK_DRIVERS };

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

// ── Trips ───────────────────────────────────────────────────

export const MOCK_TRIPS: Trip[] = [
  {
    id: 'trp_001',
    vehicleId: 'veh_001',
    driverId: 'drv_001',
    routeId: 'rte_001',
    status: 'in_progress',
    origin: 'JFK Airport, Queens',
    destination: 'Midtown Manhattan',
    scheduledStart: '2025-07-11T08:00:00Z',
    scheduledEnd: '2025-07-11T09:00:00Z',
    actualStart: '2025-07-11T08:05:00Z',
    actualEnd: null,
    distanceKm: 28.4,
    fuelUsedLiters: null,
    passengerCount: 12,
    notes: null,
  },
  {
    id: 'trp_002',
    vehicleId: 'veh_003',
    driverId: 'drv_002',
    routeId: 'rte_002',
    status: 'in_progress',
    origin: 'Penn Station, Manhattan',
    destination: 'Newark Liberty Airport',
    scheduledStart: '2025-07-11T08:30:00Z',
    scheduledEnd: '2025-07-11T09:30:00Z',
    actualStart: '2025-07-11T08:32:00Z',
    actualEnd: null,
    distanceKm: 22.1,
    fuelUsedLiters: null,
    passengerCount: 24,
    notes: null,
  },
  {
    id: 'trp_003',
    vehicleId: 'veh_005',
    driverId: 'drv_003',
    routeId: 'rte_003',
    status: 'scheduled',
    origin: 'LaGuardia Airport',
    destination: 'Downtown Brooklyn',
    scheduledStart: '2025-07-11T10:00:00Z',
    scheduledEnd: '2025-07-11T11:00:00Z',
    actualStart: null,
    actualEnd: null,
    distanceKm: 19.8,
    fuelUsedLiters: null,
    passengerCount: null,
    notes: 'VIP transfer - handle with priority',
  },
  {
    id: 'trp_004',
    vehicleId: 'veh_002',
    driverId: 'drv_004',
    routeId: null,
    status: 'completed',
    origin: 'Grand Central, Manhattan',
    destination: 'Stamford, CT',
    scheduledStart: '2025-07-11T06:00:00Z',
    scheduledEnd: '2025-07-11T07:15:00Z',
    actualStart: '2025-07-11T06:02:00Z',
    actualEnd: '2025-07-11T07:18:00Z',
    distanceKm: 54.3,
    fuelUsedLiters: 6.8,
    passengerCount: 8,
    notes: null,
  },
  {
    id: 'trp_005',
    vehicleId: 'veh_001',
    driverId: 'drv_001',
    routeId: 'rte_001',
    status: 'completed',
    origin: 'Midtown Manhattan',
    destination: 'JFK Airport, Queens',
    scheduledStart: '2025-07-10T16:00:00Z',
    scheduledEnd: '2025-07-10T17:00:00Z',
    actualStart: '2025-07-10T16:00:00Z',
    actualEnd: '2025-07-10T17:05:00Z',
    distanceKm: 29.1,
    fuelUsedLiters: 4.2,
    passengerCount: 15,
    notes: null,
  },
  {
    id: 'trp_006',
    vehicleId: 'veh_003',
    driverId: 'drv_002',
    routeId: null,
    status: 'cancelled',
    origin: 'Wall Street, Manhattan',
    destination: 'Long Island City',
    scheduledStart: '2025-07-10T14:00:00Z',
    scheduledEnd: '2025-07-10T15:00:00Z',
    actualStart: null,
    actualEnd: null,
    distanceKm: 11.2,
    fuelUsedLiters: null,
    passengerCount: null,
    notes: 'Client cancelled – weather conditions',
  },
];

// ── Maintenance Records ──────────────────────────────────────

export const MOCK_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'mnt_001',
    vehicleId: 'veh_004',
    type: 'engine_check',
    description: 'Full engine diagnostic and tune-up',
    status: 'in_progress',
    scheduledDate: '2025-07-10',
    completedDate: null,
    costUsd: null,
    technicianName: 'Carlos Ruiz',
    notes: 'Detected minor oil leak – fixing concurrently',
  },
  {
    id: 'mnt_002',
    vehicleId: 'veh_006',
    type: 'full_service',
    description: 'Complete vehicle overhaul – 100k service',
    status: 'overdue',
    scheduledDate: '2025-06-01',
    completedDate: null,
    costUsd: null,
    technicianName: null,
    notes: 'Delayed due to parts availability',
  },
  {
    id: 'mnt_003',
    vehicleId: 'veh_002',
    type: 'tire_rotation',
    description: 'Rotate and balance all four tires',
    status: 'pending',
    scheduledDate: '2025-07-15',
    completedDate: null,
    costUsd: 120,
    technicianName: 'Mike Johnson',
    notes: null,
  },
  {
    id: 'mnt_004',
    vehicleId: 'veh_001',
    type: 'oil_change',
    description: '5000km oil and filter change',
    status: 'completed',
    scheduledDate: '2025-05-10',
    completedDate: '2025-05-10',
    costUsd: 85,
    technicianName: 'Carlos Ruiz',
    notes: null,
  },
];

// ── Expenses ────────────────────────────────────────────────

export const MOCK_EXPENSES: Expense[] = [
  { id: 'exp_001', vehicleId: 'veh_001', driverId: 'drv_001', tripId: 'trp_005', category: 'fuel', amountUsd: 62.40, description: 'Fuel refill – Shell station', date: '2025-07-10', receiptUrl: null, approvedBy: 'mgr_001' },
  { id: 'exp_002', vehicleId: 'veh_004', driverId: null, tripId: null, category: 'maintenance', amountUsd: 340.00, description: 'Engine diagnostic', date: '2025-07-10', receiptUrl: null, approvedBy: 'mgr_001' },
  { id: 'exp_003', vehicleId: 'veh_003', driverId: 'drv_002', tripId: 'trp_002', category: 'tolls', amountUsd: 18.50, description: 'Holland Tunnel toll', date: '2025-07-11', receiptUrl: null, approvedBy: null },
  { id: 'exp_004', vehicleId: 'veh_005', driverId: 'drv_003', tripId: null, category: 'fuel', amountUsd: 88.20, description: 'Fuel refill – BP station', date: '2025-07-09', receiptUrl: null, approvedBy: 'mgr_001' },
  { id: 'exp_005', vehicleId: null, driverId: null, tripId: null, category: 'insurance', amountUsd: 2400.00, description: 'Monthly fleet insurance premium', date: '2025-07-01', receiptUrl: null, approvedBy: 'mgr_001' },
];

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
    title: "Today's Trips",
    value: 6,
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
    id: 'kpi_fuel',
    title: 'Fuel Spend',
    value: '$150.60',
    unit: 'today',
    trend: 'down',
    trendValue: '-8.2% vs yesterday',
    icon: 'Fuel',
    color: 'amber',
  },
  {
    id: 'kpi_maintenance',
    title: 'Maintenance Alerts',
    value: 3,
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
