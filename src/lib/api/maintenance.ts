// ──────────────────────────────────────────────────────────────
// src/lib/api/maintenance.ts
// Maintenance CRUD API calls.
// Normalizes backend Prisma schema → frontend MaintenanceRecord type.
// ──────────────────────────────────────────────────────────────

import { apiClient } from '../apiClient';
import type { MaintenanceRecord, MaintenanceStatus } from '@/types';

// ── Backend DTO (matches Prisma schema) ─────────────────────

interface MaintenanceDTO {
  id: number;
  vehicleId: number;
  serviceType: string;
  description: string;
  cost: number | string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  startDate: string;
  endDate: string | null;
}

// ── Status mapping ───────────────────────────────────────────

function mapStatus(s: MaintenanceDTO['status']): MaintenanceStatus {
  const map: Record<MaintenanceDTO['status'], MaintenanceStatus> = {
    OPEN: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
  };
  return map[s] ?? 'scheduled';
}

function mapStatusToDTO(s: MaintenanceStatus): MaintenanceDTO['status'] {
  const map: Record<MaintenanceStatus, MaintenanceDTO['status']> = {
    scheduled: 'OPEN',
    in_progress: 'IN_PROGRESS',
    completed: 'COMPLETED',
    cancelled: 'OPEN',
  };
  return map[s] ?? 'OPEN';
}

// ── Normalizer ───────────────────────────────────────────────

function normalizeMaintenance(dto: MaintenanceDTO): MaintenanceRecord {
  return {
    id: String(dto.id),
    vehicleId: String(dto.vehicleId),
    type: 'other',
    description: dto.description,
    status: mapStatus(dto.status),
    scheduledDate: dto.startDate,
    completedDate: dto.endDate ?? null,
    priority: 'medium',
    estimatedCost: parseFloat(String(dto.cost)) || null,
    actualCost: dto.status === 'COMPLETED' ? (parseFloat(String(dto.cost)) || null) : null,
    partsUsed: null,
    technicianName: null,
    notes: dto.serviceType,
  };
}

// ── API ──────────────────────────────────────────────────────

export const maintenanceApi = {
  getAll: async (params?: Record<string, string>): Promise<MaintenanceRecord[]> => {
    const { data } = await apiClient.get<{ data: MaintenanceDTO[] }>('/maintenance', { params });
    return data.data.map(normalizeMaintenance);
  },

  getById: async (id: string | number): Promise<MaintenanceRecord> => {
    const { data } = await apiClient.get<{ data: MaintenanceDTO }>(`/maintenance/${id}`);
    return normalizeMaintenance(data.data);
  },

  create: async (record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    const payload = {
      vehicleId: parseInt(record.vehicleId ?? '0'),
      serviceType: record.notes ?? record.type ?? 'General Service',
      description: record.description ?? '',
      cost: record.estimatedCost ?? 0,
      status: mapStatusToDTO(record.status ?? 'scheduled'),
      startDate: record.scheduledDate ?? new Date().toISOString(),
    };
    const { data } = await apiClient.post<{ data: MaintenanceDTO }>('/maintenance', payload);
    return normalizeMaintenance(data.data);
  },

  update: async (id: string | number, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    const payload: Partial<Record<string, unknown>> = {};
    if (record.description) payload.description = record.description;
    if (record.notes || record.type) payload.serviceType = record.notes ?? record.type;
    if (record.estimatedCost !== undefined) payload.cost = record.estimatedCost;
    if (record.status) payload.status = mapStatusToDTO(record.status);
    if (record.scheduledDate) payload.startDate = record.scheduledDate;
    if (record.completedDate) payload.endDate = record.completedDate;
    const { data } = await apiClient.patch<{ data: MaintenanceDTO }>(`/maintenance/${id}`, payload);
    return normalizeMaintenance(data.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/maintenance/${id}`);
  },
};
