// ──────────────────────────────────────────────────────────────
// src/lib/apiClient.ts
// Axios instance pre-configured for TransitOps API.
// Attaches JWT Bearer token and handles 401 logout.
// ──────────────────────────────────────────────────────────────

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'transitops_token';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach token ───────────────────────

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 ────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      // Emit a custom event so AuthContext can react without circular imports
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ── Token helpers ────────────────────────────────────────────

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

// ── Backend availability check ────────────────────────────────

let _backendAvailable: boolean | null = null;

export async function checkBackendAvailable(): Promise<boolean> {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 3000 });
    _backendAvailable = true;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

export function resetBackendAvailabilityCache(): void {
  _backendAvailable = null;
}
