// ──────────────────────────────────────────────────────────────
// src/lib/api/drivers.ts
// Driver CRUD API calls.
// Normalizes backend Prisma schema → frontend Driver type.
// ──────────────────────────────────────────────────────────────

import { apiClient } from '../apiClient';
import type { Driver, DriverStatus } from '@/types';

// ── Backend DTO (matches Prisma schema) ─────────────────────

interface DriverDTO {
  id: number;
  name: string;
  licenseNumber: string;
  category: string;
  expiryDate: string;
  contact: string;
  safetyScore: number | string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

// ── Status mapping ───────────────────────────────────────────

function mapStatus(s: DriverDTO['status']): DriverStatus {
  const map: Record<DriverDTO['status'], DriverStatus> = {
    AVAILABLE: 'available',
    ON_TRIP: 'on_trip',
    OFF_DUTY: 'on_leave',
    SUSPENDED: 'suspended',
  };
  return map[s] ?? 'available';
}

function mapStatusToDTO(s: DriverStatus): DriverDTO['status'] {
  const map: Record<DriverStatus, DriverDTO['status']> = {
    available: 'AVAILABLE',
    on_trip: 'ON_TRIP',
    on_leave: 'OFF_DUTY',
    inactive: 'OFF_DUTY',
    suspended: 'SUSPENDED',
  };
  return map[s] ?? 'AVAILABLE';
}

// ── Normalizer: DriverDTO → Driver ──────────────────────────

function normalizeDriver(dto: DriverDTO): Driver {
  // Split name "First Last" to firstName/lastName
  const parts = dto.name.trim().split(/\s+/);
  const firstName = parts[0] ?? dto.name;
  const lastName = parts.slice(1).join(' ') || '—';

  return {
    id: String(dto.id),
    firstName,
    lastName,
    employeeId: `EMP-${String(dto.id).padStart(4, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s/g, '').replace(/—/, 'driver')}@transitops.io`,
    phone: dto.contact,
    address: 'On file',
    licenseNumber: dto.licenseNumber,
    licenseCategory: dto.category,
    licenseExpiry: dto.expiryDate,
    experienceYears: 2,
    emergencyContact: dto.contact,
    medicalFitnessStatus: 'fit',
    status: mapStatus(dto.status),
    vehicleId: null,
    totalTrips: 0,
    totalDistance: 0,
    rating: parseFloat(String(dto.safetyScore)) || 4.0,
    joinedAt: dto.createdAt,
    avatar: null,
  };
}

// ── API ──────────────────────────────────────────────────────

export const driversApi = {
  getAll: async (params?: Record<string, string>): Promise<Driver[]> => {
    const { data } = await apiClient.get<{ data: DriverDTO[] }>('/drivers', { params });
    return data.data.map(normalizeDriver);
  },

  getById: async (id: string | number): Promise<Driver> => {
    const { data } = await apiClient.get<{ data: DriverDTO }>(`/drivers/${id}`);
    return normalizeDriver(data.data);
  },

  create: async (driver: Partial<Driver>): Promise<Driver> => {
    const payload = {
      name: `${driver.firstName ?? ''} ${driver.lastName ?? ''}`.trim(),
      licenseNumber: driver.licenseNumber ?? '',
      category: driver.licenseCategory ?? 'B',
      expiryDate: driver.licenseExpiry ?? new Date().toISOString(),
      contact: driver.phone ?? '',
      safetyScore: driver.rating ?? 4.0,
      status: mapStatusToDTO(driver.status ?? 'available'),
    };
    const { data } = await apiClient.post<{ data: DriverDTO }>('/drivers', payload);
    return normalizeDriver(data.data);
  },

  update: async (id: string | number, driver: Partial<Driver>): Promise<Driver> => {
    const payload: Partial<Record<string, unknown>> = {};
    if (driver.firstName || driver.lastName) {
      payload.name = `${driver.firstName ?? ''} ${driver.lastName ?? ''}`.trim();
    }
    if (driver.licenseNumber) payload.licenseNumber = driver.licenseNumber;
    if (driver.licenseCategory) payload.category = driver.licenseCategory;
    if (driver.licenseExpiry) payload.expiryDate = driver.licenseExpiry;
    if (driver.phone) payload.contact = driver.phone;
    if (driver.rating !== undefined) payload.safetyScore = driver.rating;
    if (driver.status) payload.status = mapStatusToDTO(driver.status);
    const { data } = await apiClient.patch<{ data: DriverDTO }>(`/drivers/${id}`, payload);
    return normalizeDriver(data.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/drivers/${id}`);
  },
};
