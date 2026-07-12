/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/types';
import { MOCK_CURRENT_USER } from '@/services/mockData';
import { authApi } from '@/lib/api/auth';
import { tokenStorage, checkBackendAvailable } from '@/lib/apiClient';

// ── Types ───────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Context ─────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────

interface AuthProviderProps {
  children: React.ReactNode;
}

/** Maps a backend user DTO to the frontend User type. */
function mapBackendUser(backendUser: { id: number; name: string; email: string; role: string }): User {
  const parts = backendUser.name.trim().split(/\s+/);
  return {
    id: String(backendUser.id),
    firstName: parts[0] ?? backendUser.name,
    lastName: parts.slice(1).join(' ') || '',
    email: backendUser.email,
    role: (backendUser.role.toLowerCase() as User['role']) || 'viewer',
    avatar: null,
    lastLogin: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading while we check for existing session
  });

  // ── Session restore on mount ─────────────────────────────

  useEffect(() => {
    async function restoreSession() {
      const token = tokenStorage.get();
      if (!token) {
        // No stored token — check if backend is reachable. If not, use mock auth.
        const backendUp = await checkBackendAvailable();
        if (!backendUp) {
          // Fall back to mock auto-login so app is usable without backend
          setState({ user: MOCK_CURRENT_USER, isAuthenticated: true, isLoading: false });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
        return;
      }

      try {
        const result = await authApi.me();
        setState({
          user: mapBackendUser(result.user),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        // Token invalid / backend down — clear token and fall through to login
        tokenStorage.clear();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    }

    restoreSession();
  }, []);

  // ── Handle auth:logout event from apiClient 401 handler ──

  useEffect(() => {
    const handler = () => {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    };
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  // ── Login ────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const backendUp = await checkBackendAvailable();

    if (!backendUp) {
      // ── Mock fallback (no backend / offline) ─────────────
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Accept the demo credentials; reject everything else
      const validDemoEmails = [
        'admin@transitops.in',
        'dispatch@transitops.in',
      ];
      if (!validDemoEmails.includes(email.toLowerCase())) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw new Error('Invalid credentials');
      }
      setState({
        user: { ...MOCK_CURRENT_USER, email },
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }

    // ── Real backend login ───────────────────────────────
    const result = await authApi.login(email, password);
    tokenStorage.set(result.token);
    setState({
      user: mapBackendUser(result.user),
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  // ── Logout ───────────────────────────────────────────────

  const logout = useCallback((): void => {
    // Fire-and-forget server logout (stateless JWT)
    authApi.logout().catch(() => {});
    tokenStorage.clear();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
