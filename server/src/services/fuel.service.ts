import { prisma } from '../config/prisma';
import { ApiError } from '../utils/api-error';

export class FuelService {
  /**
   * List fuel logs with optional query filtering
   */
  public static async getFuelLogs(filters?: {
    vehicleId?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const whereClause: any = {};

    if (filters?.vehicleId) whereClause.vehicleId = filters.vehicleId;
    if (filters?.startDate || filters?.endDate) {
      whereClause.date = {};
      if (filters.startDate) whereClause.date.gte = filters.startDate;
      if (filters.endDate) whereClause.date.lte = filters.endDate;
    }

    return prisma.fuelLog.findMany({
      where: whereClause,
      include: {
        vehicle: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Find a single fuel log by ID
   */
  public static async getFuelLogById(id: number) {
    const fuelLog = await prisma.fuelLog.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!fuelLog) {
      throw new ApiError(404, 'Fuel log not found');
    }

    return fuelLog;
  }

  /**
   * Create a new fuel log
   */
  public static async createFuelLog(data: {
    vehicleId: number;
    liters: number;
    cost: number;
    date: Date;
  }) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    return prisma.fuelLog.create({
      data,
      include: {
        vehicle: true,
      },
    });
  }

  /**
   * Update an existing fuel log
   */
  public static async updateFuelLog(
    id: number,
    data: {
      vehicleId?: number;
      liters?: number;
      cost?: number;
      date?: Date;
    }
  ) {
    const fuelLog = await prisma.fuelLog.findUnique({
      where: { id },
    });

    if (!fuelLog) {
      throw new ApiError(404, 'Fuel log not found');
    }

    if (data.vehicleId && data.vehicleId !== fuelLog.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
      });

      if (!vehicle) {
        throw new ApiError(404, 'Vehicle not found');
      }
    }

    return prisma.fuelLog.update({
      where: { id },
      data,
      include: {
        vehicle: true,
      },
    });
  }

  /**
   * Delete a fuel log
   */
  public static async deleteFuelLog(id: number) {
    const fuelLog = await prisma.fuelLog.findUnique({
      where: { id },
    });

    if (!fuelLog) {
      throw new ApiError(404, 'Fuel log not found');
    }

    return prisma.fuelLog.delete({
      where: { id },
    });
  }
}
