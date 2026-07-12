// ──────────────────────────────────────────────────────────────
// src/types/dashboard.ts
// Dashboard-specific TypeScript types – FE-002
// ──────────────────────────────────────────────────────────────

import type React from 'react';

// ── Fleet utilization chart data ────────────────────────────

export interface UtilizationDataPoint {
  date: string;
  utilization: number; // 0–100 percentage
}

// ── Activity feed ────────────────────────────────────────────

export type ActivityEventType =
  | 'trip_started'
  | 'trip_completed'
  | 'trip_cancelled'
  | 'vehicle_assigned'
  | 'driver_added'
  | 'maintenance_scheduled'
  | 'maintenance_completed';

export interface ActivityFeedItem {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  timestamp: string; // ISO datetime
  entityId: string;
}

// ── Fleet status display item ────────────────────────────────

export interface FleetStatusDisplayItem {
  label: string;
  count: number;
  color: string;          // Tailwind bg class
  textColor: string;      // Tailwind text class
  borderColor: string;    // Tailwind border class
}

// ── Chart series definition ──────────────────────────────────

export interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
  gradientId?: string;
}

// ── Section card wrapper props ───────────────────────────────

export interface DashboardCardProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  children: React.ReactNode;
  className?: string;
}
