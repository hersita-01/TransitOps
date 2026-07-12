// ──────────────────────────────────────────────────────────────
// TransitOps – Shared TypeScript Types
// ──────────────────────────────────────────────────────────────

// ── Enums / Literal Unions ──────────────────────────────────

export type VehicleStatus = 'active' | 'idle' | 'maintenance' | 'offline';
export type DriverStatus = 'available' | 'on_trip' | 'on_leave' | 'inactive' | 'suspended';
export type TripStatus = 'draft' | 'scheduled' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type ExpenseCategory = 'fuel' | 'maintenance' | 'tolls' | 'insurance' | 'other';
export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'viewer';
export type TrendDirection = 'up' | 'down' | 'neutral';

// ── Vehicle ─────────────────────────────────────────────────

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'bus' | 'van' | 'truck' | 'sedan';
  fuelType: 'diesel' | 'electric' | 'hybrid' | 'gasoline';
  capacity: number;
  status: VehicleStatus;
  driverId: string | null;
  mileage: number;
  fuelLevel: number; // 0-100 percentage
  lastServiceDate: string; // ISO date
  nextServiceDue: string; // ISO date
  insuranceExpiry: string; // ISO date
  purchaseDate: string; // ISO date
  location: GeoLocation | null;
  assignedRoute: string | null;
  createdAt: string;
}

// ── Driver ──────────────────────────────────────────────────

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string; // ISO date
  experienceYears: number;
  emergencyContact: string;
  medicalFitnessStatus: 'fit' | 'unfit' | 'pending';
  status: DriverStatus;
  vehicleId: string | null;
  totalTrips: number;
  totalDistance: number; // km
  rating: number; // 1-5
  joinedAt: string; // ISO date
  avatar: string | null;
}

// ── Trip ────────────────────────────────────────────────────

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  routeId: string | null;
  status: TripStatus;
  origin: string;
  destination: string;
  scheduledStart: string; // ISO datetime
  scheduledEnd: string; // ISO datetime
  actualStart: string | null;
  actualEnd: string | null;
  distanceKm: number;
  cargoDescription: string | null;
  cargoWeight: number | null; // kg
  estimatedFuelLiters: number | null;
  fuelUsedLiters: number | null;
  passengerCount: number | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string | null;
}

// ── Maintenance Record ──────────────────────────────────────

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'engine_check' | 'full_service' | 'other';
  description: string;
  status: MaintenanceStatus;
  scheduledDate: string; // ISO date
  completedDate: string | null;
  costUsd: number | null;
  technicianName: string | null;
  notes: string | null;
}

// ── Expense ─────────────────────────────────────────────────

export interface Expense {
  id: string;
  vehicleId: string | null;
  driverId: string | null;
  tripId: string | null;
  category: ExpenseCategory;
  amountUsd: number;
  description: string;
  date: string; // ISO date
  receiptUrl: string | null;
  approvedBy: string | null;
}

// ── Route ───────────────────────────────────────────────────

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedMinutes: number;
  waypoints: GeoLocation[];
  isActive: boolean;
}

// ── Geo ─────────────────────────────────────────────────────

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

// ── User / Auth ─────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  lastLogin: string;
}

// ── Dashboard / KPI ─────────────────────────────────────────

export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend: TrendDirection;
  trendValue: string; // e.g. "+12.5%"
  icon: string; // lucide icon name
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan';
}

export interface FleetStatusSummary {
  active: number;
  idle: number;
  maintenance: number;
  offline: number;
  total: number;
}

export interface FuelSummary {
  totalLiters: number;
  totalCostUsd: number;
  avgEfficiencyKmPerLiter: number;
  monthlyData: Array<{ month: string; liters: number; costUsd: number }>;
}

export interface MaintenanceSummary {
  pending: number;
  inProgress: number;
  overdue: number;
  completedThisMonth: number;
  totalCostThisMonthUsd: number;
}

export interface TripAnalytics {
  totalTrips: number;
  completed: number;
  cancelled: number;
  avgDurationMinutes: number;
  totalDistanceKm: number;
  weeklyData: Array<{ day: string; trips: number; distance: number }>;
}

// ── Table / Pagination ──────────────────────────────────────

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string;
}

// ── Generic API Response (ready for backend integration) ────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationState;
}
