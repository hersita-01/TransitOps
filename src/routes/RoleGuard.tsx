import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

/**
 * RoleGuard – Restricts access based on user role.
 * Renders children only if the current user's role is in allowedRoles.
 * Replace with real RBAC logic once backend is integrated.
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = '/dashboard',
}: RoleGuardProps): React.JSX.Element {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
