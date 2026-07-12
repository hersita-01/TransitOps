// ──────────────────────────────────────────────────────────────
// src/lib/api/trips.ts
// Trip CRUD API calls.
// Normalizes backend Prisma schema → frontend Trip type.
// ──────────────────────────────────────────────────────────────

import { apiClient } from '../apiClient';
import type { Trip, TripStatus } from '@/types';

// ── Backend DTO (matches Prisma schema) ─────────────────────

interface TripDTO {
  id: number;
  vehicleId: number;
  driverId: number;
  source: string;
  destination: string;
  cargoWeight: number | string;
  plannedDistance: number | string;
  actualDistance: number | string | null;
  fuelUsed: number | string | null;
  status: 'DRAFT' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime: string | null;
  createdAt: string;
}

// ── Status mapping ───────────────────────────────────────────

function mapStatus(s: TripDTO['status']): TripStatus {
  const map: Record<TripDTO['status'], TripStatus> = {
    DRAFT: 'draft',
    DISPATCHED: 'dispatched',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  };
  return map[s] ?? 'draft';
}

function mapStatusToDTO(s: TripStatus): TripDTO['status'] {
  const map: Record<TripStatus, TripDTO['status']> = {
    draft: 'DRAFT',
    scheduled: 'DRAFT',
    dispatched: 'DISPATCHED',
    in_progress: 'DISPATCHED',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
  };
  return map[s] ?? 'DRAFT';
}

// ── Normalizer: TripDTO → Trip ──────────────────────────────

function normalizeTrip(dto: TripDTO): Trip {
  return {
    id: String(dto.id),
    vehicleId: String(dto.vehicleId),
    driverId: String(dto.driverId),
    routeId: null,
    status: mapStatus(dto.status),
    origin: dto.source,
    destination: dto.destination,
    scheduledStart: dto.startTime,
    scheduledEnd: dto.endTime ?? new Date(new Date(dto.startTime).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    actualStart: dto.status !== 'DRAFT' ? dto.startTime : null,
    actualEnd: dto.endTime ?? null,
    distanceKm: parseFloat(String(dto.plannedDistance)) || 0,
    cargoDescription: null,
    cargoWeight: parseFloat(String(dto.cargoWeight)) || null,
    estimatedFuelLiters: null,
    fuelUsedLiters: dto.fuelUsed ? parseFloat(String(dto.fuelUsed)) : null,
    passengerCount: null,
    priority: 'medium',
    notes: null,
  };
}

// ── API ──────────────────────────────────────────────────────

export const tripsApi = {
  getAll: async (params?: Record<string, string>): Promise<Trip[]> => {
    const { data } = await apiClient.get<{ data: TripDTO[] }>('/trips', { params });
    return data.data.map(normalizeTrip);
  },

  getById: async (id: string | number): Promise<Trip> => {
    const { data } = await apiClient.get<{ data: TripDTO }>(`/trips/${id}`);
    return normalizeTrip(data.data);
  },

  create: async (trip: Partial<Trip>): Promise<Trip> => {
    const payload = {
      vehicleId: parseInt(trip.vehicleId ?? '0'),
      driverId: parseInt(trip.driverId ?? '0'),
      source: trip.origin ?? '',
      destination: trip.destination ?? '',
      cargoWeight: trip.cargoWeight ?? 0,
      plannedDistance: trip.distanceKm ?? 0,
      status: mapStatusToDTO(trip.status ?? 'draft'),
      startTime: trip.scheduledStart ?? new Date().toISOString(),
    };
    const { data } = await apiClient.post<{ data: TripDTO }>('/trips', payload);
    return normalizeTrip(data.data);
  },

  update: async (id: string | number, trip: Partial<Trip>): Promise<Trip> => {
    const payload: Partial<Record<string, unknown>> = {};
    if (trip.vehicleId) payload.vehicleId = parseInt(trip.vehicleId);
    if (trip.driverId) payload.driverId = parseInt(trip.driverId);
    if (trip.origin) payload.source = trip.origin;
    if (trip.destination) payload.destination = trip.destination;
    if (trip.cargoWeight !== undefined) payload.cargoWeight = trip.cargoWeight;
    if (trip.distanceKm !== undefined) payload.plannedDistance = trip.distanceKm;
    if (trip.status) payload.status = mapStatusToDTO(trip.status);
    if (trip.scheduledStart) payload.startTime = trip.scheduledStart;
    if (trip.actualEnd) payload.endTime = trip.actualEnd;
    const { data } = await apiClient.patch<{ data: TripDTO }>(`/trips/${id}`, payload);
    return normalizeTrip(data.data);
  },

  dispatch: async (id: string | number): Promise<Trip> => {
    const { data } = await apiClient.post<{ data: TripDTO }>(`/trips/${id}/dispatch`);
    return normalizeTrip(data.data);
  },

  complete: async (id: string | number, payload?: { actualDistance?: number; fuelUsed?: number }): Promise<Trip> => {
    const { data } = await apiClient.post<{ data: TripDTO }>(`/trips/${id}/complete`, payload ?? {});
    return normalizeTrip(data.data);
  },

  cancel: async (id: string | number): Promise<Trip> => {
    const { data } = await apiClient.post<{ data: TripDTO }>(`/trips/${id}/cancel`);
    return normalizeTrip(data.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/trips/${id}`);
  },
};
