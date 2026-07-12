import React, { useState, useMemo } from 'react';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsKPIs } from '@/components/analytics/AnalyticsKPIs';
import { AnalyticsFilters, type AnalyticsFilterState } from '@/components/analytics/AnalyticsFilters';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { AnalyticsReports } from '@/components/analytics/AnalyticsReports';
import { AnalyticsTables } from '@/components/analytics/AnalyticsTables';
import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_TRIPS, MOCK_MAINTENANCE, MOCK_EXPENSES } from '@/services/mockData';
import {
  calculateFleetKPIs,
  getExpenseCategoryBreakdown,
  getVehicleStatusDistribution,
  getDriverStatusDistribution,
  getTripStatusDistribution,
  getDailyTrends,
  getTopVehicles,
  getTopDrivers,
  exportToCSV
} from '@/utils/analytics';

export function AnalyticsPage(): React.JSX.Element {
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    startDate: '',
    endDate: '',
    vehicleId: '',
    driverId: '',
    tripStatus: '',
    vehicleType: '',
    expenseCategory: ''
  });

  const {
    filteredVehicles,
    filteredDrivers,
    filteredTrips,
    filteredMaintenance,
    filteredExpenses
  } = useMemo(() => {
    let v = [...MOCK_VEHICLES];
    let d = [...MOCK_DRIVERS];
    let t = [...MOCK_TRIPS];
    let m = [...MOCK_MAINTENANCE];
    let e = [...MOCK_EXPENSES];

    // Global Date Filter (applies to trips, maint, expenses)
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      t = t.filter(x => new Date(x.scheduledStart).getTime() >= start);
      m = m.filter(x => new Date(x.scheduledDate).getTime() >= start);
      e = e.filter(x => new Date(x.date).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime() + 86400000;
      t = t.filter(x => new Date(x.scheduledStart).getTime() <= end);
      m = m.filter(x => new Date(x.scheduledDate).getTime() <= end);
      e = e.filter(x => new Date(x.date).getTime() <= end);
    }

    // Vehicle Filter
    if (filters.vehicleId) {
      v = v.filter(x => x.id === filters.vehicleId);
      t = t.filter(x => x.vehicleId === filters.vehicleId);
      m = m.filter(x => x.vehicleId === filters.vehicleId);
      e = e.filter(x => x.vehicleId === filters.vehicleId);
    }

    // Driver Filter
    if (filters.driverId) {
      d = d.filter(x => x.id === filters.driverId);
      t = t.filter(x => x.driverId === filters.driverId);
      e = e.filter(x => x.driverId === filters.driverId);
    }

    // Trip Status
    if (filters.tripStatus) {
      t = t.filter(x => x.status === filters.tripStatus);
    }

    // Vehicle Type
    if (filters.vehicleType) {
      v = v.filter(x => x.type === filters.vehicleType);
      const validVids = new Set(v.map(x => x.id));
      t = t.filter(x => validVids.has(x.vehicleId));
      m = m.filter(x => validVids.has(x.vehicleId));
      e = e.filter(x => x.vehicleId && validVids.has(x.vehicleId));
    }

    // Expense Category
    if (filters.expenseCategory) {
      e = e.filter(x => x.category === filters.expenseCategory);
    }

    return {
      filteredVehicles: v,
      filteredDrivers: d,
      filteredTrips: t,
      filteredMaintenance: m,
      filteredExpenses: e
    };
  }, [filters]);

  const metrics = useMemo(() => calculateFleetKPIs(filteredVehicles, filteredTrips, filteredExpenses), [filteredVehicles, filteredTrips, filteredExpenses]);
  const expenseCat = useMemo(() => getExpenseCategoryBreakdown(filteredExpenses), [filteredExpenses]);
  const vStat = useMemo(() => getVehicleStatusDistribution(filteredVehicles), [filteredVehicles]);
  const dStat = useMemo(() => getDriverStatusDistribution(filteredDrivers), [filteredDrivers]);
  const tStat = useMemo(() => getTripStatusDistribution(filteredTrips), [filteredTrips]);
  const trends = useMemo(() => getDailyTrends(filteredTrips, filteredExpenses), [filteredTrips, filteredExpenses]);
  
  const topVehicles = useMemo(() => getTopVehicles(filteredVehicles, filteredTrips), [filteredVehicles, filteredTrips]);
  const topDrivers = useMemo(() => getTopDrivers(filteredDrivers, filteredTrips), [filteredDrivers, filteredTrips]);
  
  const recentExpenses = useMemo(() => [...filteredExpenses].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [filteredExpenses]);
  const recentMaintenance = useMemo(() => [...filteredMaintenance].sort((a,b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()), [filteredMaintenance]);
  const recentTrips = useMemo(() => [...filteredTrips].sort((a,b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime()), [filteredTrips]);

  const handleExportCsv = () => {
    // Basic CSV export for KPI metrics
    exportToCSV('fleet_analytics_summary.csv', [metrics]);
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '', endDate: '', vehicleId: '', driverId: '', tripStatus: '', vehicleType: '', expenseCategory: ''
    });
  };

  return (
    <div className="print:bg-white print:text-black print:p-0">
      <AnalyticsHeader onExportCsv={handleExportCsv} />
      
      <AnalyticsKPIs metrics={metrics} />
      
      <AnalyticsFilters 
        filters={filters} 
        onChange={setFilters} 
        onReset={handleResetFilters} 
      />
      
      <AnalyticsCharts 
        dailyTrends={trends}
        expenseCategoryBreakdown={expenseCat}
        vehicleStatusDist={vStat}
        driverStatusDist={dStat}
        tripStatusDist={tStat}
      />
      
      <AnalyticsReports 
        drivers={filteredDrivers}
        trips={filteredTrips}
        expenses={filteredExpenses}
        topVehicles={topVehicles}
        topDrivers={topDrivers}
      />
      
      <AnalyticsTables 
        topVehicles={topVehicles}
        topDrivers={topDrivers}
        recentExpenses={recentExpenses}
        recentMaintenance={recentMaintenance}
        recentTrips={recentTrips}
      />
    </div>
  );
}
