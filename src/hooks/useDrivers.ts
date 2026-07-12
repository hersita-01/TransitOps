// ──────────────────────────────────────────────────────────────
// src/hooks/useDrivers.ts
// Data hook: fetches drivers from real API, falls back to mocks.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { Driver } from '@/types';
import { driversApi } from '@/lib/api/drivers';
import { checkBackendAvailable } from '@/lib/apiClient';
import { getMockDrivers, saveMockDrivers } from '@/lib/mockStorage';
import { useToast } from '@/context/ToastContext';

interface UseDriversResult {
  drivers: Driver[];
  isLoading: boolean;
  isUsingMock: boolean;
  refetch: () => void;
  addDriver: (data: Partial<Driver>) => Promise<void>;
  updateDriver: (id: string, data: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
}

export function useDrivers(): UseDriversResult {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendUp = await checkBackendAvailable();
      if (!backendUp) throw new Error('backend_offline');
      const data = await driversApi.getAll();
      setDrivers(data);
      setIsUsingMock(false);
    } catch {
      setDrivers(getMockDrivers());
      setIsUsingMock(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleMockChange = () => {
      setDrivers(getMockDrivers());
    };
    window.addEventListener('transitops_mock_change', handleMockChange);
    return () => window.removeEventListener('transitops_mock_change', handleMockChange);
  }, [load]);

  const addDriver = useCallback(async (data: Partial<Driver>) => {
    if (isUsingMock) {
      const newDriver: Driver = {
        ...(data as Driver),
        id: `drv_${Math.random().toString(36).substr(2, 9)}`,
        status: data.status || 'available',
        joinedAt: new Date().toISOString(),
        rating: 5.0,
        totalTrips: 0,
        totalDistance: 0,
        avatar: null,
      };
      setDrivers((prev) => {
        const next = [newDriver, ...prev];
        saveMockDrivers(next);
        return next;
      });
      toast('success', 'Driver Added', `${data.firstName} ${data.lastName} added (demo mode).`);
      return;
    }
    try {
      const created = await driversApi.create(data);
      setDrivers((prev) => [created, ...prev]);
      toast('success', 'Driver Added', `${data.firstName} ${data.lastName} added.`);
    } catch (err) {
      toast('error', 'Failed to Add Driver', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const updateDriver = useCallback(async (id: string, data: Partial<Driver>) => {
    if (isUsingMock) {
      setDrivers((prev) => {
        const next = prev.map((d) => (d.id === id ? { ...d, ...data } : d));
        saveMockDrivers(next);
        return next;
      });
      toast('success', 'Driver Updated', 'Changes saved (demo mode).');
      return;
    }
    try {
      const updated = await driversApi.update(id, data);
      setDrivers((prev) => prev.map((d) => (d.id === id ? updated : d)));
      toast('success', 'Driver Updated', 'Changes saved successfully.');
    } catch (err) {
      toast('error', 'Failed to Update Driver', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const deleteDriver = useCallback(async (id: string) => {
    if (isUsingMock) {
      setDrivers((prev) => {
        const next = prev.filter((d) => d.id !== id);
        saveMockDrivers(next);
        return next;
      });
      toast('success', 'Driver Deleted', 'Driver removed (demo mode).');
      return;
    }
    try {
      await driversApi.delete(id);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      toast('success', 'Driver Deleted', 'Driver removed successfully.');
    } catch (err) {
      toast('error', 'Failed to Delete Driver', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  return { drivers, isLoading, isUsingMock, refetch: load, addDriver, updateDriver, deleteDriver };
}
