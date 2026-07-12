import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy loaded pages
const LoginPage       = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage   = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const FleetPage       = lazy(() => import('@/pages/FleetPage').then(m => ({ default: m.FleetPage })));
const DriversPage     = lazy(() => import('@/pages/DriversPage').then(m => ({ default: m.DriversPage })));
const TripsPage       = lazy(() => import('@/pages/TripsPage').then(m => ({ default: m.TripsPage })));
const MaintenancePage = lazy(() => import('@/pages/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const ExpensesPage    = lazy(() => import('@/pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const AnalyticsPage   = lazy(() => import('@/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage    = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ProfilePage     = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const HelpPage        = lazy(() => import('@/pages/HelpPage').then(m => ({ default: m.HelpPage })));
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

export function AppRouter(): React.JSX.Element {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PageSuspense><LoginPage /></PageSuspense>} />

      {/* Protected dashboard routes — all share DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><DashboardPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fleet"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><FleetPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><DriversPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><TripsPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><MaintenancePage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><ExpensesPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><AnalyticsPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><SettingsPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><ProfilePage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PageSuspense><HelpPage /></PageSuspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<PageSuspense><NotFoundPage /></PageSuspense>} />
    </Routes>
  );
}
