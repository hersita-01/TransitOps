import { prisma } from '../config/prisma';
import { VehicleStatus } from '../shared/enums/VehicleStatus';
import { ApiError } from '../utils/api-error';

export class VehicleService {
  /**
   * List vehicles with optional query filtering
   */
  public static async getVehicles(filters?: {
    status?: VehicleStatus;
    type?: string;
    search?: string;
  }) {
    const whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.type) {
      whereClause.type = {
        contains: filters.type,
        mode: 'insensitive',
      };
    }

    if (filters?.search) {
      whereClause.OR = [
        {
          registrationNumber: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          model: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return prisma.vehicle.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a single vehicle by ID
   */
  public static async getVehicleById(id: number) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    return vehicle;
  }

  /**
   * Create a new vehicle
   */
  public static async createVehicle(data: {
    registrationNumber: string;
    model: string;
    type: string;
    capacity: number;
    odometer: number;
    acquisitionCost: number;
    status: VehicleStatus;
  }) {
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { registrationNumber: data.registrationNumber },
    });

    if (existingVehicle) {
      throw new ApiError(409, 'Vehicle registration number already exists');
    }

    return prisma.vehicle.create({
      data: {
        registrationNumber: data.registrationNumber,
        model: data.model,
        type: data.type,
        capacity: data.capacity,
        odometer: data.odometer,
        acquisitionCost: data.acquisitionCost,
        status: data.status,
      },
    });
  }

  /**
   * Update an existing vehicle
   */
  public static async updateVehicle(
    id: number,
    data: {
      registrationNumber?: string;
      model?: string;
      type?: string;
      capacity?: number;
      odometer?: number;
      acquisitionCost?: number;
      status?: VehicleStatus;
    }
  ) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { registrationNumber: data.registrationNumber },
      });

      if (existingVehicle) {
        throw new ApiError(409, 'Vehicle registration number already exists');
      }
    }

    // Only update validated and defined fields
    const updateData: any = {};
    if (data.registrationNumber !== undefined) updateData.registrationNumber = data.registrationNumber;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.odometer !== undefined) updateData.odometer = data.odometer;
    if (data.acquisitionCost !== undefined) updateData.acquisitionCost = data.acquisitionCost;
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.vehicle.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a vehicle and prevent violating relational integrity
   */
  public static async deleteVehicle(id: number) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            trips: true,
            maintenances: true,
            fuelLogs: true,
            expenses: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    const { trips, maintenances, fuelLogs, expenses } = vehicle._count;
    if (trips > 0 || maintenances > 0 || fuelLogs > 0 || expenses > 0) {
      throw new ApiError(
        409,
        'Cannot delete vehicle because it has dependent operational records (trips, maintenance, fuel logs, or expenses)'
      );
    }

    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
