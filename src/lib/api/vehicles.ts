// ──────────────────────────────────────────────────────────────
// src/lib/api/vehicles.ts
// Vehicle CRUD API calls.
// Normalizes backend Prisma schema → frontend Vehicle type.
// ──────────────────────────────────────────────────────────────

import { apiClient } from '../apiClient';
import type { Vehicle, VehicleStatus } from '@/types';

// ── Backend DTO (matches Prisma schema) ─────────────────────

interface VehicleDTO {
  id: number;
  registrationNumber: string;
  model: string;
  type: string;
  capacity: number;
  odometer: number;
  acquisitionCost: number | string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
  createdAt: string;
  updatedAt: string;
}

// ── Status mapping (DB enum → FE literal) ───────────────────

function mapStatus(s: VehicleDTO['status']): VehicleStatus {
  const map: Record<VehicleDTO['status'], VehicleStatus> = {
    AVAILABLE: 'idle',
    ON_TRIP: 'active',
    IN_SHOP: 'maintenance',
    RETIRED: 'offline',
  };
  return map[s] ?? 'idle';
}

function mapStatusToDTO(s: VehicleStatus): VehicleDTO['status'] {
  const map: Record<VehicleStatus, VehicleDTO['status']> = {
    idle: 'AVAILABLE',
    active: 'ON_TRIP',
    maintenance: 'IN_SHOP',
    offline: 'RETIRED',
  };
  return map[s] ?? 'AVAILABLE';
}

// ── Normalizer: VehicleDTO → Vehicle ────────────────────────

function normalizeVehicle(dto: VehicleDTO): Vehicle {
  return {
    id: String(dto.id),
    plateNumber: dto.registrationNumber,
    make: dto.model.split(' ')[0] ?? dto.model,
    model: dto.model,
    year: new Date(dto.createdAt).getFullYear(),
    type: (dto.type.toLowerCase() as Vehicle['type']) || 'van',
    fuelType: 'diesel',           // Not in DB schema; default
    capacity: dto.capacity,
    status: mapStatus(dto.status),
    driverId: null,               // Not in Vehicle model in DB
    mileage: dto.odometer,
    fuelLevel: 100,               // Not in DB schema; default
    lastServiceDate: dto.createdAt.split('T')[0],
    nextServiceDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    purchaseDate: dto.createdAt.split('T')[0],
    location: null,
    assignedRoute: null,
    createdAt: dto.createdAt,
  };
}

// ── API ──────────────────────────────────────────────────────

export const vehiclesApi = {
  getAll: async (params?: Record<string, string>): Promise<Vehicle[]> => {
    const { data } = await apiClient.get<{ data: VehicleDTO[] }>('/vehicles', { params });
    return data.data.map(normalizeVehicle);
  },

  getById: async (id: string | number): Promise<Vehicle> => {
    const { data } = await apiClient.get<{ data: VehicleDTO }>(`/vehicles/${id}`);
    return normalizeVehicle(data.data);
  },

  create: async (vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const payload = {
      registrationNumber: vehicle.plateNumber,
      model: `${vehicle.make ?? ''} ${vehicle.model ?? ''}`.trim(),
      type: (vehicle.type ?? 'van').toUpperCase(),
      capacity: vehicle.capacity ?? 1,
      odometer: vehicle.mileage ?? 0,
      acquisitionCost: 0,
      status: mapStatusToDTO(vehicle.status ?? 'idle'),
    };
    const { data } = await apiClient.post<{ data: VehicleDTO }>('/vehicles', payload);
    return normalizeVehicle(data.data);
  },

  update: async (id: string | number, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const payload: Partial<Record<string, unknown>> = {};
    if (vehicle.plateNumber) payload.registrationNumber = vehicle.plateNumber;
    if (vehicle.make || vehicle.model) payload.model = `${vehicle.make ?? ''} ${vehicle.model ?? ''}`.trim();
    if (vehicle.type) payload.type = vehicle.type.toUpperCase();
    if (vehicle.capacity !== undefined) payload.capacity = vehicle.capacity;
    if (vehicle.mileage !== undefined) payload.odometer = vehicle.mileage;
    if (vehicle.status) payload.status = mapStatusToDTO(vehicle.status);
    const { data } = await apiClient.patch<{ data: VehicleDTO }>(`/vehicles/${id}`, payload);
    return normalizeVehicle(data.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },
};
