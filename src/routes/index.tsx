import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { LoginPage }      from '@/pages/LoginPage';
import { DashboardPage }  from '@/pages/DashboardPage';
import { FleetPage }      from '@/pages/FleetPage';
import { DriversPage }    from '@/pages/DriversPage';
import { TripsPage }      from '@/pages/TripsPage';
import { MaintenancePage } from '@/pages/MaintenancePage';
import { ExpensesPage }   from '@/pages/ExpensesPage';
import { AnalyticsPage }  from '@/pages/AnalyticsPage';
import { SettingsPage }   from '@/pages/SettingsPage';
import { NotFoundPage }   from '@/pages/NotFoundPage';

export function AppRouter(): React.JSX.Element {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected dashboard routes — all share DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fleet"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <FleetPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DriversPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TripsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MaintenancePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExpensesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
