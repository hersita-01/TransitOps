// ──────────────────────────────────────────────────────────────
// src/hooks/useTrips.ts
// Data hook: fetches trips from real API, falls back to mocks.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { Trip } from '@/types';
import { tripsApi } from '@/lib/api/trips';
import { checkBackendAvailable } from '@/lib/apiClient';
import { MOCK_TRIPS } from '@/mock/trips';
import { useToast } from '@/context/ToastContext';

interface UseTripsResult {
  trips: Trip[];
  isLoading: boolean;
  isUsingMock: boolean;
  refetch: () => void;
  addTrip: (data: Partial<Trip>) => Promise<void>;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<void>;
  dispatchTrip: (id: string) => Promise<void>;
  completeTrip: (id: string, payload?: { actualDistance?: number; fuelUsed?: number }) => Promise<void>;
  cancelTrip: (id: string) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

export function useTrips(): UseTripsResult {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendUp = await checkBackendAvailable();
      if (!backendUp) throw new Error('backend_offline');
      const data = await tripsApi.getAll();
      setTrips(data);
      setIsUsingMock(false);
    } catch {
      setTrips(MOCK_TRIPS);
      setIsUsingMock(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTrip = useCallback(async (data: Partial<Trip>) => {
    if (isUsingMock) {
      const newTrip: Trip = {
        ...(data as Trip),
        id: `trp_${Math.random().toString(36).substr(2, 9)}`,
      };
      setTrips((prev) => [newTrip, ...prev]);
      toast('success', 'Trip Added', `Trip from ${data.origin} to ${data.destination} added (demo mode).`);
      return;
    }
    try {
      const created = await tripsApi.create(data);
      setTrips((prev) => [created, ...prev]);
      toast('success', 'Trip Added', `Trip to ${data.destination} added.`);
    } catch (err) {
      toast('error', 'Failed to Add Trip', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const updateTrip = useCallback(async (id: string, data: Partial<Trip>) => {
    if (isUsingMock) {
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, ...data } : t));
      toast('success', 'Trip Updated', 'Changes saved (demo mode).');
      return;
    }
    try {
      const updated = await tripsApi.update(id, data);
      setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
      toast('success', 'Trip Updated', 'Changes saved successfully.');
    } catch (err) {
      toast('error', 'Failed to Update Trip', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const dispatchTrip = useCallback(async (id: string) => {
    if (isUsingMock) {
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status: 'dispatched', actualStart: new Date().toISOString() } : t));
      toast('success', 'Trip Dispatched', 'Trip is now in progress (demo mode).');
      return;
    }
    try {
      const updated = await tripsApi.dispatch(id);
      setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
      toast('success', 'Trip Dispatched', 'Trip is now in progress.');
    } catch (err) {
      toast('error', 'Failed to Dispatch Trip', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const completeTrip = useCallback(async (id: string, payload?: { actualDistance?: number; fuelUsed?: number }) => {
    if (isUsingMock) {
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status: 'completed', actualEnd: new Date().toISOString(), distanceKm: payload?.actualDistance ?? t.distanceKm, fuelUsedLiters: payload?.fuelUsed ?? t.fuelUsedLiters } : t));
      toast('success', 'Trip Completed', 'Trip marked as completed (demo mode).');
      return;
    }
    try {
      const updated = await tripsApi.complete(id, payload);
      setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
      toast('success', 'Trip Completed', 'Trip marked as completed.');
    } catch (err) {
      toast('error', 'Failed to Complete Trip', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const cancelTrip = useCallback(async (id: string) => {
    if (isUsingMock) {
      setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status: 'cancelled' } : t));
      toast('success', 'Trip Cancelled', 'Trip cancelled (demo mode).');
      return;
    }
    try {
      const updated = await tripsApi.cancel(id);
      setTrips((prev) => prev.map((t) => t.id === id ? updated : t));
      toast('success', 'Trip Cancelled', 'Trip has been cancelled.');
    } catch (err) {
      toast('error', 'Failed to Cancel Trip', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const deleteTrip = useCallback(async (id: string) => {
    if (isUsingMock) {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast('success', 'Trip Deleted', 'Trip removed (demo mode).');
      return;
    }
    try {
      await tripsApi.delete(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast('success', 'Trip Deleted', 'Trip removed successfully.');
    } catch (err) {
      toast('error', 'Failed to Delete Trip', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  return { trips, isLoading, isUsingMock, refetch: load, addTrip, updateTrip, dispatchTrip, completeTrip, cancelTrip, deleteTrip };
}
