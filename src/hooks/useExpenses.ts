// ──────────────────────────────────────────────────────────────
// src/hooks/useExpenses.ts
// Data hook: fetches expenses from real API, falls back to mocks.
// ──────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '@/types';
import { expensesApi } from '@/lib/api/expenses';
import { checkBackendAvailable } from '@/lib/apiClient';
import { getMockExpenses, saveMockExpenses } from '@/lib/mockStorage';
import { useToast } from '@/context/ToastContext';

interface UseExpensesResult {
  expenses: Expense[];
  isLoading: boolean;
  isUsingMock: boolean;
  refetch: () => void;
  addExpense: (data: Partial<Expense>) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendUp = await checkBackendAvailable();
      if (!backendUp) throw new Error('backend_offline');
      const data = await expensesApi.getAll();
      setExpenses(data);
      setIsUsingMock(false);
    } catch {
      setExpenses(getMockExpenses());
      setIsUsingMock(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handleMockChange = () => {
      setExpenses(getMockExpenses());
    };
    window.addEventListener('transitops_mock_change', handleMockChange);
    return () => window.removeEventListener('transitops_mock_change', handleMockChange);
  }, [load]);

  const addExpense = useCallback(async (data: Partial<Expense>) => {
    if (isUsingMock) {
      const newExpense: Expense = {
        ...(data as Expense),
        id: `exp_${Math.random().toString(36).substr(2, 9)}`,
      };
      setExpenses((prev) => {
        const next = [newExpense, ...prev];
        saveMockExpenses(next);
        return next;
      });
      toast('success', 'Expense Logged', 'Expense record added (demo mode).');
      return;
    }
    try {
      const created = await expensesApi.create(data);
      setExpenses((prev) => [created, ...prev]);
      toast('success', 'Expense Logged', 'Expense record added.');
    } catch (err) {
      toast('error', 'Failed to Log Expense', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const updateExpense = useCallback(async (id: string, data: Partial<Expense>) => {
    if (isUsingMock) {
      setExpenses((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e));
        saveMockExpenses(next);
        return next;
      });
      toast('success', 'Expense Updated', 'Changes saved (demo mode).');
      return;
    }
    try {
      const updated = await expensesApi.update(id, data);
      setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast('success', 'Expense Updated', 'Changes saved successfully.');
    } catch (err) {
      toast('error', 'Failed to Update Expense', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  const deleteExpense = useCallback(async (id: string) => {
    if (isUsingMock) {
      setExpenses((prev) => {
        const next = prev.filter((e) => e.id !== id);
        saveMockExpenses(next);
        return next;
      });
      toast('success', 'Expense Deleted', 'Record removed (demo mode).');
      return;
    }
    try {
      await expensesApi.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast('success', 'Expense Deleted', 'Record removed successfully.');
    } catch (err) {
      toast('error', 'Failed to Delete Expense', 'Please try again.');
      throw err;
    }
  }, [isUsingMock, toast]);

  return { expenses, isLoading, isUsingMock, refetch: load, addExpense, updateExpense, deleteExpense };
}
