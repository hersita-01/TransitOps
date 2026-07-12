import { prisma } from '../config/prisma';
import { VehicleStatus } from '../shared/enums/VehicleStatus';
import { DriverStatus } from '../shared/enums/DriverStatus';
import { TripStatus } from '../shared/enums/TripStatus';
import { MaintenanceStatus } from '../shared/enums/MaintenanceStatus';

export class DashboardService {
  /**
   * Retrieves high-level operational KPIs for the dashboard.
   * Utilizes database-side aggregations for efficiency.
   */
  public static async getDashboardKpis() {
    const [
      totalVehicles,
      availableVehicles,
      vehiclesOnTrip,
      vehiclesInShop,
      retiredVehicles,
      totalDrivers,
      availableDrivers,
      driversOnTrip,
      suspendedDrivers,
      totalTrips,
      activeTrips,
      completedTrips,
      cancelledTrips,
      activeMaintenance,
      fuelAggregation,
      expenseAggregation
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.IN_SHOP } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.RETIRED } }),
      
      prisma.driver.count(),
      prisma.driver.count({ where: { status: DriverStatus.AVAILABLE } }),
      prisma.driver.count({ where: { status: DriverStatus.ON_TRIP } }),
      prisma.driver.count({ where: { status: DriverStatus.SUSPENDED } }),
      
      prisma.trip.count(),
      prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
      prisma.trip.count({ where: { status: TripStatus.COMPLETED } }),
      prisma.trip.count({ where: { status: TripStatus.CANCELLED } }),
      
      prisma.maintenance.count({ 
        where: { 
          status: { in: [MaintenanceStatus.OPEN, MaintenanceStatus.IN_PROGRESS] } 
        } 
      }),
      
      prisma.fuelLog.aggregate({
        _sum: { cost: true }
      }),
      
      prisma.expense.aggregate({
        _sum: { amount: true }
      })
    ]);

    // Normalize aggregation results for frontend compatibility (null -> 0)
    const totalFuelCost = fuelAggregation._sum.cost ? Number(fuelAggregation._sum.cost) : 0;
    const totalExpenseAmount = expenseAggregation._sum.amount ? Number(expenseAggregation._sum.amount) : 0;

    return {
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        onTrip: vehiclesOnTrip,
        inShop: vehiclesInShop,
        retired: retiredVehicles,
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onTrip: driversOnTrip,
        suspended: suspendedDrivers,
      },
      trips: {
        total: totalTrips,
        active: activeTrips,
        completed: completedTrips,
        cancelled: cancelledTrips,
      },
      maintenance: {
        active: activeMaintenance,
      },
      financials: {
        totalFuelCost,
        totalExpenses: totalExpenseAmount,
        totalOperationalCost: totalFuelCost + totalExpenseAmount,
      }
    };
  }
}
