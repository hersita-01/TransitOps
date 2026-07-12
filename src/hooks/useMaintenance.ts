// ──────────────────────────────────────────────────────────────
// src/hooks/useMaintenance.ts
// Data hook: fetches maintenance records from real API, falls back to mocks.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { MaintenanceRecord } from '@/types';
import { maintenanceApi } from '@/lib/api/maintenance';
import { checkBackendAvailable } from '@/lib/apiClient';
import { MOCK_MAINTENANCE } from '@/mock/maintenance';
import { useToast } from '@/context/ToastContext';

interface UseMaintenanceResult {
  records: MaintenanceRecord[];
  isLoading: boolean;
  isUsingMock: boolean;
  refetch: () => void;
  addRecord: (data: Partial<MaintenanceRecord>) => Promise<void>;
  updateRecord: (id: string, data: Partial<MaintenanceRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export function useMaintenance(): UseMaintenanceResult {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendUp = await checkBackendAvailable();
      if (!backendUp) throw new Error('backend_offline');
      const data = await maintenanceApi.getAll();
      setRecords(data);
      setIsUsingMock(false);
    } catch {
      setRecords(MOCK_MAINTENANCE);
      setIsUsingMock(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addRecord = useCallback(async (data: Partial<MaintenanceRecord>) => {
    if (isUsingMock) {
      const newRecord: MaintenanceRecord = {
        ...(data as MaintenanceRecord),
        id: `maint_${Math.random().toString(36).substr(2, 9)}`,
      };
      setRecords((prev) => [newRecord, ...prev]);
      toast('success', 'Maintenance Added', 'Service record added (demo mode).');
      return;
    }
    try {
      const created = await maintenanceApi.create(data);
      setRecords((prev) => [created, ...prev]);
      toast('success', 'Maintenance Added', 'Service record added.');
    } catch (err) {
      toast('error', 'Failed to Add Maintenance', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const updateRecord = useCallback(async (id: string, data: Partial<MaintenanceRecord>) => {
    if (isUsingMock) {
      setRecords((prev) => prev.map((r) => r.id === id ? { ...r, ...data } : r));
      toast('success', 'Maintenance Updated', 'Changes saved (demo mode).');
      return;
    }
    try {
      const updated = await maintenanceApi.update(id, data);
      setRecords((prev) => prev.map((r) => r.id === id ? updated : r));
      toast('success', 'Maintenance Updated', 'Changes saved successfully.');
    } catch (err) {
      toast('error', 'Failed to Update Maintenance', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const deleteRecord = useCallback(async (id: string) => {
    if (isUsingMock) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast('success', 'Maintenance Deleted', 'Record removed (demo mode).');
      return;
    }
    try {
      await maintenanceApi.delete(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast('success', 'Maintenance Deleted', 'Record removed successfully.');
    } catch (err) {
      toast('error', 'Failed to Delete Maintenance', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  return { records, isLoading, isUsingMock, refetch: load, addRecord, updateRecord, deleteRecord };
}
