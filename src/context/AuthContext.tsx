import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '@/types';
import { MOCK_CURRENT_USER } from '@/services/mockData';

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

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  // Mock: start as authenticated so we can see the dashboard
  const [state, setState] = useState<AuthState>({
    user: MOCK_CURRENT_USER,
    isAuthenticated: true,
    isLoading: false,
  });

  /**
   * Mock login — accepts any credentials, returns mock user.
   * Replace with real API call when backend is ready.
   */
  const login = useCallback(async (email: string, _password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setState({
      user: { ...MOCK_CURRENT_USER, email },
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback((): void => {
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
