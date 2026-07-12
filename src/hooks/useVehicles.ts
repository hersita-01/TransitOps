// ──────────────────────────────────────────────────────────────
// src/hooks/useVehicles.ts
// Data hook: fetches vehicles from real API, falls back to mocks.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { Vehicle } from '@/types';
import { vehiclesApi } from '@/lib/api/vehicles';
import { checkBackendAvailable } from '@/lib/apiClient';
import { getMockVehicles, saveMockVehicles } from '@/lib/mockStorage';
import { useToast } from '@/context/ToastContext';

interface UseVehiclesResult {
  vehicles: Vehicle[];
  isLoading: boolean;
  isUsingMock: boolean;
  refetch: () => void;
  addVehicle: (data: Partial<Vehicle>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendUp = await checkBackendAvailable();
      if (!backendUp) throw new Error('backend_offline');
      const data = await vehiclesApi.getAll();
      setVehicles(data);
      setIsUsingMock(false);
    } catch {
      // Fallback to mock data
      setVehicles(getMockVehicles());
      setIsUsingMock(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleMockChange = () => {
      setVehicles(getMockVehicles());
    };
    window.addEventListener('transitops_mock_change', handleMockChange);
    return () => window.removeEventListener('transitops_mock_change', handleMockChange);
  }, [load]);

  const addVehicle = useCallback(async (data: Partial<Vehicle>) => {
    if (isUsingMock) {
      const newVehicle: Vehicle = {
        ...(data as Vehicle),
        id: `veh_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        fuelLevel: 100,
        mileage: 0,
        lastServiceDate: new Date().toISOString(),
        nextServiceDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        location: null,
        assignedRoute: null,
      };
      setVehicles((prev) => {
        const next = [newVehicle, ...prev];
        saveMockVehicles(next);
        return next;
      });
      toast('success', 'Vehicle Added', `${data.plateNumber || 'New vehicle'} has been added (demo mode).`);
      return;
    }
    try {
      const created = await vehiclesApi.create(data);
      setVehicles((prev) => [created, ...prev]);
      toast('success', 'Vehicle Added', `${data.plateNumber} has been added.`);
    } catch (err) {
      toast('error', 'Failed to Add Vehicle', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const updateVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
    if (isUsingMock) {
      setVehicles((prev) => {
        const next = prev.map((v) => (v.id === id ? { ...v, ...data } : v));
        saveMockVehicles(next);
        return next;
      });
      toast('success', 'Vehicle Updated', 'Changes saved (demo mode).');
      return;
    }
    try {
      const updated = await vehiclesApi.update(id, data);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      toast('success', 'Vehicle Updated', 'Changes saved successfully.');
    } catch (err) {
      toast('error', 'Failed to Update Vehicle', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const deleteVehicle = useCallback(async (id: string) => {
    if (isUsingMock) {
      setVehicles((prev) => {
        const next = prev.filter((v) => v.id !== id);
        saveMockVehicles(next);
        return next;
      });
      toast('success', 'Vehicle Deleted', 'Vehicle removed (demo mode).');
      return;
    }
    try {
      await vehiclesApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      toast('success', 'Vehicle Deleted', 'Vehicle removed successfully.');
    } catch (err) {
      toast('error', 'Failed to Delete Vehicle', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  return { vehicles, isLoading, isUsingMock, refetch: load, addVehicle, updateVehicle, deleteVehicle };
}
