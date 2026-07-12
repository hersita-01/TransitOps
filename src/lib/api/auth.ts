// ──────────────────────────────────────────────────────────────
// src/lib/api/auth.ts
// Auth API calls: login, logout, me
// ──────────────────────────────────────────────────────────────

import { apiClient } from '../apiClient';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface MeResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post<{ data: LoginResponse }>('/auth/login', {
      email,
      password,
    });
    return data.data;
  },

  me: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get<{ data: MeResponse }>('/auth/me');
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
