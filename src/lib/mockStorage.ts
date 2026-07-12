// ──────────────────────────────────────────────────────────────
// src/lib/mockStorage.ts
// Persistent storage for mock data in localStorage so CRUD operations
// (Add, Edit, Delete) persist across page navigations and reloads.
// ──────────────────────────────────────────────────────────────

import type { Vehicle, Driver, Trip, MaintenanceRecord, Expense } from '@/types';
import { MOCK_VEHICLES } from '@/mock/vehicles';
import { MOCK_DRIVERS } from '@/mock/drivers';
import { MOCK_TRIPS } from '@/mock/trips';
import { MOCK_MAINTENANCE } from '@/mock/maintenance';
import { MOCK_EXPENSES } from '@/mock/expenses';

const KEYS = {
  VEHICLES: 'transitops_mock_vehicles_v1',
  DRIVERS: 'transitops_mock_drivers_v1',
  TRIPS: 'transitops_mock_trips_v1',
  MAINTENANCE: 'transitops_mock_maintenance_v1',
  EXPENSES: 'transitops_mock_expenses_v1',
};

// Helper to notify other hooks/components if needed
function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('transitops_mock_change'));
  }
}

// ── VEHICLES ──────────────────────────────────────────────────

export function getMockVehicles(): Vehicle[] {
  try {
    const stored = localStorage.getItem(KEYS.VEHICLES);
    if (stored) {
      const parsed: Vehicle[] = JSON.parse(stored);
      // Keep MOCK_VEHICLES array synchronized in memory
      MOCK_VEHICLES.length = 0;
      MOCK_VEHICLES.push(...parsed);
      return parsed;
    }
  } catch {
    // ignore parse error
  }
  return [...MOCK_VEHICLES];
}

export function saveMockVehicles(vehicles: Vehicle[]): void {
  try {
    localStorage.setItem(KEYS.VEHICLES, JSON.stringify(vehicles));
    MOCK_VEHICLES.length = 0;
    MOCK_VEHICLES.push(...vehicles);
    notifyChange();
  } catch {
    // ignore storage error
  }
}

// ── DRIVERS ───────────────────────────────────────────────────

export function getMockDrivers(): Driver[] {
  try {
    const stored = localStorage.getItem(KEYS.DRIVERS);
    if (stored) {
      const parsed: Driver[] = JSON.parse(stored);
      MOCK_DRIVERS.length = 0;
      MOCK_DRIVERS.push(...parsed);
      return parsed;
    }
  } catch {
    // ignore parse error
  }
  return [...MOCK_DRIVERS];
}

export function saveMockDrivers(drivers: Driver[]): void {
  try {
    localStorage.setItem(KEYS.DRIVERS, JSON.stringify(drivers));
    MOCK_DRIVERS.length = 0;
    MOCK_DRIVERS.push(...drivers);
    notifyChange();
  } catch {
    // ignore storage error
  }
}

// ── TRIPS ─────────────────────────────────────────────────────

export function getMockTrips(): Trip[] {
  try {
    const stored = localStorage.getItem(KEYS.TRIPS);
    if (stored) {
      const parsed: Trip[] = JSON.parse(stored);
      MOCK_TRIPS.length = 0;
      MOCK_TRIPS.push(...parsed);
      return parsed;
    }
  } catch {
    // ignore parse error
  }
  return [...MOCK_TRIPS];
}

export function saveMockTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(KEYS.TRIPS, JSON.stringify(trips));
    MOCK_TRIPS.length = 0;
    MOCK_TRIPS.push(...trips);
    notifyChange();
  } catch {
    // ignore storage error
  }
}

// ── MAINTENANCE ───────────────────────────────────────────────

export function getMockMaintenance(): MaintenanceRecord[] {
  try {
    const stored = localStorage.getItem(KEYS.MAINTENANCE);
    if (stored) {
      const parsed: MaintenanceRecord[] = JSON.parse(stored);
      MOCK_MAINTENANCE.length = 0;
      MOCK_MAINTENANCE.push(...parsed);
      return parsed;
    }
  } catch {
    // ignore parse error
  }
  return [...MOCK_MAINTENANCE];
}

export function saveMockMaintenance(records: MaintenanceRecord[]): void {
  try {
    localStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(records));
    MOCK_MAINTENANCE.length = 0;
    MOCK_MAINTENANCE.push(...records);
    notifyChange();
  } catch {
    // ignore storage error
  }
}

// ── EXPENSES ──────────────────────────────────────────────────

export function getMockExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(KEYS.EXPENSES);
    if (stored) {
      const parsed: Expense[] = JSON.parse(stored);
      MOCK_EXPENSES.length = 0;
      MOCK_EXPENSES.push(...parsed);
      return parsed;
    }
  } catch {
    // ignore parse error
  }
  return [...MOCK_EXPENSES];
}

export function saveMockExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
    MOCK_EXPENSES.length = 0;
    MOCK_EXPENSES.push(...expenses);
    notifyChange();
  } catch {
    // ignore storage error
  }
}
