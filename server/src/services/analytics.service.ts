import { prisma } from '../config/prisma';
import { TripStatus } from '../shared/enums/TripStatus';

export class AnalyticsService {
  /**
   * Helper to build date range filters for different fields
   */
  private static getDateFilter(field: string, from?: Date, to?: Date) {
    if (!from && !to) return undefined;
    const filter: any = {};
    if (from) filter.gte = from;
    if (to) filter.lte = to;
    return { [field]: filter };
  }

  /**
   * Overview Analytics
   */
  public static async getOverviewAnalytics(from?: Date, to?: Date) {
    const tripDateFilter = this.getDateFilter('startTime', from, to);
    const fuelDateFilter = this.getDateFilter('date', from, to);
    const expenseDateFilter = this.getDateFilter('date', from, to);
    const maintenanceDateFilter = this.getDateFilter('startDate', from, to);

    const [
      totalTrips,
      completedTrips,
      activeTrips,
      cancelledTrips,
      tripAggregates,
      fuelAggregates,
      expenseAggregates,
      maintenanceAggregates
    ] = await Promise.all([
      prisma.trip.count({ where: tripDateFilter }),
      prisma.trip.count({ where: { ...tripDateFilter, status: TripStatus.COMPLETED } }),
      prisma.trip.count({ where: { ...tripDateFilter, status: TripStatus.DISPATCHED } }),
      prisma.trip.count({ where: { ...tripDateFilter, status: TripStatus.CANCELLED } }),
      prisma.trip.aggregate({
        where: tripDateFilter,
        _sum: { plannedDistance: true, actualDistance: true, fuelUsed: true }
      }),
      prisma.fuelLog.aggregate({
        where: fuelDateFilter,
        _sum: { cost: true, liters: true }
      }),
      prisma.expense.aggregate({
        where: expenseDateFilter,
        _sum: { amount: true }
      }),
      prisma.maintenance.aggregate({
        where: maintenanceDateFilter,
        _sum: { cost: true }
      })
    ]);

    const totalPlannedDistance = Number(tripAggregates._sum.plannedDistance || 0);
    const totalActualDistance = Number(tripAggregates._sum.actualDistance || 0);
    const totalFuelUsed = Number(tripAggregates._sum.fuelUsed || 0);
    const totalFuelCost = Number(fuelAggregates._sum.cost || 0);
    const totalExpenses = Number(expenseAggregates._sum.amount || 0);
    const maintenanceCost = Number(maintenanceAggregates._sum.cost || 0);

    return {
      totalTrips,
      completedTrips,
      activeTrips,
      cancelledTrips,
      totalPlannedDistance,
      totalActualDistance,
      totalFuelUsed,
      totalFuelCost,
      totalExpenses,
      maintenanceCost,
    };
  }

  /**
   * Trip Analytics
   */
  public static async getTripAnalytics(from?: Date, to?: Date) {
    const where = this.getDateFilter('startTime', from, to);

    const [
      totalTrips,
      completedTrips,
      tripAggregates,
      tripsByStatusRaw
    ] = await Promise.all([
      prisma.trip.count({ where }),
      prisma.trip.count({ where: { ...where, status: TripStatus.COMPLETED } }),
      prisma.trip.aggregate({
        where,
        _sum: { plannedDistance: true, actualDistance: true },
        _avg: { actualDistance: true }
      }),
      prisma.trip.groupBy({
        by: ['status'],
        where,
        _count: { status: true }
      })
    ]);

    const tripsByStatus = tripsByStatusRaw.map(g => ({
      status: g.status,
      count: g._count.status
    }));

    const completionRate = totalTrips > 0 ? (completedTrips / totalTrips) * 100 : 0;
    
    return {
      totalTrips,
      completedTrips,
      completionRate,
      tripsByStatus,
      totalPlannedDistance: Number(tripAggregates._sum.plannedDistance || 0),
      totalActualDistance: Number(tripAggregates._sum.actualDistance || 0),
      averageActualDistance: Number(tripAggregates._avg.actualDistance || 0),
    };
  }

  /**
   * Fuel Analytics
   */
  public static async getFuelAnalytics(from?: Date, to?: Date) {
    const where = this.getDateFilter('date', from, to);

    const [
      fuelAggregates,
      fuelByVehicleRaw
    ] = await Promise.all([
      prisma.fuelLog.aggregate({
        where,
        _sum: { cost: true, liters: true },
        _avg: { cost: true }
      }),
      prisma.fuelLog.groupBy({
        by: ['vehicleId'],
        where,
        _sum: { cost: true, liters: true }
      })
    ]);

    const fuelByVehicle = fuelByVehicleRaw.map(g => ({
      vehicleId: g.vehicleId,
      totalCost: Number(g._sum.cost || 0),
      totalLiters: Number(g._sum.liters || 0)
    }));

    return {
      totalFuelQuantity: Number(fuelAggregates._sum.liters || 0),
      totalFuelCost: Number(fuelAggregates._sum.cost || 0),
      averageFuelCost: Number(fuelAggregates._avg.cost || 0),
      fuelByVehicle
    };
  }

  /**
   * Expense Analytics
   */
  public static async getExpenseAnalytics(from?: Date, to?: Date) {
    const where = this.getDateFilter('date', from, to);

    const [
      expenseCount,
      expenseAggregates,
      expensesByCategoryRaw,
      expensesByVehicleRaw
    ] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
        _avg: { amount: true }
      }),
      prisma.expense.groupBy({
        by: ['category'],
        where,
        _sum: { amount: true },
        _count: { category: true }
      }),
      prisma.expense.groupBy({
        by: ['vehicleId'],
        where,
        _sum: { amount: true }
      })
    ]);

    const expensesByCategory = expensesByCategoryRaw.map(g => ({
      category: g.category,
      count: g._count.category,
      totalAmount: Number(g._sum.amount || 0)
    }));

    const expensesByVehicle = expensesByVehicleRaw.map(g => ({
      vehicleId: g.vehicleId,
      totalAmount: Number(g._sum.amount || 0)
    }));

    return {
      expenseCount,
      totalExpenses: Number(expenseAggregates._sum.amount || 0),
      averageExpense: Number(expenseAggregates._avg.amount || 0),
      expensesByCategory,
      expensesByVehicle
    };
  }
}
