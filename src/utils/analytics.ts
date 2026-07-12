import { MOCK_VEHICLES, MOCK_DRIVERS, MOCK_TRIPS, MOCK_EXPENSES } from '@/services/mockData';

// ── Global Aggregations ──────────────────────────────────────

export function calculateFleetKPIs(vehicles = MOCK_VEHICLES, trips = MOCK_TRIPS, expenses = MOCK_EXPENSES) {
  const totalFleetSize = vehicles.length;
  
  // Fleet Utilization: (Active + OnTrip) / Total
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const inMaint = vehicles.filter(v => v.status === 'maintenance').length;
  const fleetUtilization = totalFleetSize > 0 ? (activeVehicles / totalFleetSize) * 100 : 0;

  // Trips
  const completedTrips = trips.filter(t => t.status === 'completed');
  const cancelledTrips = trips.filter(t => t.status === 'cancelled');
  const totalCompleted = completedTrips.length;
  
  const avgTripDistance = totalCompleted > 0 
    ? completedTrips.reduce((sum, t) => sum + t.distanceKm, 0) / totalCompleted 
    : 0;

  // Fuel Efficiency (Total Dist / Total Liters)
  const totalFuelLiters = completedTrips.reduce((sum, t) => sum + (t.fuelUsedLiters || 0), 0);
  const totalDist = completedTrips.reduce((sum, t) => sum + t.distanceKm, 0);
  const fuelEfficiency = totalFuelLiters > 0 ? totalDist / totalFuelLiters : 0;

  // Costs (Let's assume "Monthly" is everything in our mock data since it's constrained)
  const fuelCost = expenses.filter(e => e.category === 'fuel').reduce((sum, e) => sum + e.amountUsd, 0);
  const maintCost = expenses.filter(e => e.category === 'maintenance' || e.category === 'repairs' || e.category === 'tyres').reduce((sum, e) => sum + e.amountUsd, 0);
  const otherCost = expenses.filter(e => !['fuel', 'maintenance', 'repairs', 'tyres'].includes(e.category)).reduce((sum, e) => sum + e.amountUsd, 0);
  const operationalCost = fuelCost + maintCost + otherCost;

  // Driver Utilization
  const activeDrivers = MOCK_DRIVERS.filter(d => d.status === 'available' || d.status === 'on_trip').length;
  const driverUtilization = MOCK_DRIVERS.length > 0 ? (activeDrivers / MOCK_DRIVERS.length) * 100 : 0;

  return {
    totalFleetSize,
    fleetUtilization,
    totalCompleted,
    cancelledCount: cancelledTrips.length,
    avgTripDistance,
    fuelEfficiency,
    fuelCost,
    maintCost,
    operationalCost,
    driverUtilization,
    inMaint
  };
}

// ── Chart Aggregations ────────────────────────────────────────

export function getExpenseCategoryBreakdown(expenses = MOCK_EXPENSES) {
  const map: Record<string, number> = {};
  expenses.forEach(e => {
    map[e.category] = (map[e.category] || 0) + e.amountUsd;
  });
  return Object.keys(map).map(name => ({ name, value: map[name] }));
}

export function getVehicleStatusDistribution(vehicles = MOCK_VEHICLES) {
  const map: Record<string, number> = {};
  vehicles.forEach(v => {
    map[v.status] = (map[v.status] || 0) + 1;
  });
  return Object.keys(map).map(name => ({ name, value: map[name] }));
}

export function getDriverStatusDistribution(drivers = MOCK_DRIVERS) {
  const map: Record<string, number> = {};
  drivers.forEach(d => {
    map[d.status] = (map[d.status] || 0) + 1;
  });
  return Object.keys(map).map(name => ({ name, value: map[name] }));
}

export function getTripStatusDistribution(trips = MOCK_TRIPS) {
  const map: Record<string, number> = {};
  trips.forEach(t => {
    map[t.status] = (map[t.status] || 0) + 1;
  });
  return Object.keys(map).map(name => ({ name, value: map[name] }));
}

export function getDailyTrends(trips = MOCK_TRIPS, expenses = MOCK_EXPENSES) {
  // Combine dates from trips and expenses
  const dates = new Set<string>();
  trips.forEach(t => dates.add(t.scheduledStart.split('T')[0]));
  expenses.forEach(e => dates.add(e.date.split('T')[0]));
  
  const sortedDates = Array.from(dates).sort();
  
  return sortedDates.map(date => {
    const dayTrips = trips.filter(t => t.scheduledStart.startsWith(date));
    const dayExpenses = expenses.filter(e => e.date.startsWith(date));
    
    return {
      date,
      trips: dayTrips.length,
      fuelCost: dayExpenses.filter(e => e.category === 'fuel').reduce((s, e) => s + e.amountUsd, 0),
      maintCost: dayExpenses.filter(e => e.category === 'maintenance' || e.category === 'repairs').reduce((s, e) => s + e.amountUsd, 0),
      otherCost: dayExpenses.filter(e => !['fuel', 'maintenance', 'repairs'].includes(e.category)).reduce((s, e) => s + e.amountUsd, 0),
    };
  });
}

// ── Top Rankings ──────────────────────────────────────────────

export function getTopVehicles(vehicles = MOCK_VEHICLES, trips = MOCK_TRIPS, limit = 10) {
  return vehicles
    .map(v => {
      const vTrips = trips.filter(t => t.vehicleId === v.id);
      return { ...v, tripCount: vTrips.length, dist: vTrips.reduce((s, t) => s + t.distanceKm, 0) };
    })
    .sort((a, b) => b.tripCount - a.tripCount)
    .slice(0, limit);
}

export function getTopDrivers(drivers = MOCK_DRIVERS, trips = MOCK_TRIPS, limit = 10) {
  return drivers
    .map(d => {
      const dTrips = trips.filter(t => t.driverId === d.id);
      return { ...d, tripCount: dTrips.length };
    })
    .sort((a, b) => b.tripCount - a.tripCount)
    .slice(0, limit);
}

// ── CSV Export ────────────────────────────────────────────────

export function exportToCSV(filename: string, rows: object[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let cell = (row as Record<string, unknown>)[k] === null || (row as Record<string, unknown>)[k] === undefined ? '' : (row as Record<string, unknown>)[k] as any;
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
