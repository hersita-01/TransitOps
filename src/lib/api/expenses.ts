// ──────────────────────────────────────────────────────────────
// src/lib/api/expenses.ts
// Expense CRUD API calls.
// Normalizes backend Prisma schema → frontend Expense type.
// ──────────────────────────────────────────────────────────────

import { apiClient } from '../apiClient';
import type { Expense } from '@/types';

// ── Backend DTO (matches Prisma schema) ─────────────────────

interface ExpenseDTO {
  id: number;
  vehicleId: number;
  category: string;
  amount: number | string;
  description: string;
  date: string;
}

// ── Normalizer ───────────────────────────────────────────────

function normalizeExpense(dto: ExpenseDTO): Expense {
  return {
    id: String(dto.id),
    vehicleId: String(dto.vehicleId),
    driverId: null,
    tripId: null,
    category: (dto.category.toLowerCase() as Expense['category']) || 'miscellaneous',
    amountUsd: parseFloat(String(dto.amount)) || 0,
    vendor: null,
    description: dto.description,
    date: dto.date.split('T')[0],
    receiptUrl: null,
    status: 'approved',
    approvedBy: null,
  };
}

// ── API ──────────────────────────────────────────────────────

export const expensesApi = {
  getAll: async (params?: Record<string, string>): Promise<Expense[]> => {
    const { data } = await apiClient.get<{ data: ExpenseDTO[] }>('/expenses', { params });
    return data.data.map(normalizeExpense);
  },

  getById: async (id: string | number): Promise<Expense> => {
    const { data } = await apiClient.get<{ data: ExpenseDTO }>(`/expenses/${id}`);
    return normalizeExpense(data.data);
  },

  create: async (expense: Partial<Expense>): Promise<Expense> => {
    const payload = {
      vehicleId: parseInt(expense.vehicleId ?? '0'),
      category: (expense.category ?? 'miscellaneous').toUpperCase(),
      amount: expense.amountUsd ?? 0,
      description: expense.description ?? '',
      date: expense.date ?? new Date().toISOString(),
    };
    const { data } = await apiClient.post<{ data: ExpenseDTO }>('/expenses', payload);
    return normalizeExpense(data.data);
  },

  update: async (id: string | number, expense: Partial<Expense>): Promise<Expense> => {
    const payload: Partial<Record<string, unknown>> = {};
    if (expense.vehicleId) payload.vehicleId = parseInt(expense.vehicleId);
    if (expense.category) payload.category = expense.category.toUpperCase();
    if (expense.amountUsd !== undefined) payload.amount = expense.amountUsd;
    if (expense.description) payload.description = expense.description;
    if (expense.date) payload.date = expense.date;
    const { data } = await apiClient.patch<{ data: ExpenseDTO }>(`/expenses/${id}`, payload);
    return normalizeExpense(data.data);
  },

  delete: async (id: string | number): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
  },
};
