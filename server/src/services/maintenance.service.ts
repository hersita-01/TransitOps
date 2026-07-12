import { prisma } from '../config/prisma';
import { MaintenanceStatus } from '../shared/enums/MaintenanceStatus';
import { VehicleStatus } from '../shared/enums/VehicleStatus';
import { ApiError } from '../utils/api-error';

export class MaintenanceService {
  /**
   * List maintenance records with optional query filtering
   */
  public static async getMaintenanceRecords(filters?: {
    status?: MaintenanceStatus;
    vehicleId?: number;
    serviceType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const whereClause: any = {};

    if (filters?.status) whereClause.status = filters.status;
    if (filters?.vehicleId) whereClause.vehicleId = filters.vehicleId;
    if (filters?.serviceType) {
      whereClause.serviceType = {
        contains: filters.serviceType,
        mode: 'insensitive',
      };
    }
    
    if (filters?.startDate || filters?.endDate) {
      whereClause.startDate = {};
      if (filters.startDate) whereClause.startDate.gte = filters.startDate;
      if (filters.endDate) whereClause.startDate.lte = filters.endDate;
    }

    return prisma.maintenance.findMany({
      where: whereClause,
      include: {
        vehicle: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Find a single maintenance record by ID
   */
  public static async getMaintenanceById(id: number) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!maintenance) {
      throw new ApiError(404, 'Maintenance record not found');
    }

    return maintenance;
  }

  /**
   * Create a new maintenance record and atomically update vehicle to IN_SHOP
   */
  public static async createMaintenance(data: {
    vehicleId: number;
    serviceType: string;
    description: string;
    cost: number;
    startDate: Date;
    endDate?: Date;
  }) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    const vehicleStatus = vehicle.status as string;

    if (vehicleStatus === VehicleStatus.ON_TRIP) {
      throw new ApiError(400, 'Vehicle currently on trip cannot enter maintenance');
    }

    if (vehicleStatus === VehicleStatus.RETIRED) {
      throw new ApiError(400, 'Retired vehicle cannot enter maintenance');
    }

    // Check for another active maintenance record
    const activeMaintenance = await prisma.maintenance.findFirst({
      where: {
        vehicleId: data.vehicleId,
        status: {
          in: [MaintenanceStatus.OPEN, MaintenanceStatus.IN_PROGRESS],
        },
      },
    });

    if (activeMaintenance) {
      throw new ApiError(409, 'Vehicle already has active maintenance');
    }

    // Atomically create maintenance and update vehicle status
    return prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenance.create({
        data: {
          ...data,
          status: MaintenanceStatus.OPEN, // Default state
        },
        include: {
          vehicle: true,
        },
      });

      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: VehicleStatus.IN_SHOP },
      });

      return maintenance;
    });
  }

  /**
   * Update an existing maintenance record (safe generic fields only)
   */
  public static async updateMaintenance(
    id: number,
    data: {
      serviceType?: string;
      description?: string;
      cost?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
    });

    if (!maintenance) {
      throw new ApiError(404, 'Maintenance record not found');
    }

    if (maintenance.status === MaintenanceStatus.COMPLETED) {
      throw new ApiError(400, 'Cannot update a closed maintenance record');
    }

    return prisma.maintenance.update({
      where: { id },
      data,
      include: {
        vehicle: true,
      },
    });
  }

  /**
   * Close a maintenance record and atomically update vehicle to AVAILABLE
   */
  public static async closeMaintenance(
    id: number,
    data: {
      endDate: Date;
    }
  ) {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        vehicle: true,
      }
    });

    if (!maintenance) {
      throw new ApiError(404, 'Maintenance record not found');
    }

    if (maintenance.status === MaintenanceStatus.COMPLETED) {
      throw new ApiError(400, 'Maintenance is already closed');
    }

    if (data.endDate < maintenance.startDate) {
      throw new ApiError(400, 'End date cannot be before start date');
    }

    const vehicleStatus = maintenance.vehicle.status as string;

    if (vehicleStatus === VehicleStatus.ON_TRIP) {
      throw new ApiError(409, 'Cannot release a vehicle that is currently ON_TRIP');
    }

    // Atomically close maintenance and release vehicle
    return prisma.$transaction(async (tx) => {
      const updatedMaintenance = await tx.maintenance.update({
        where: { id },
        data: {
          status: MaintenanceStatus.COMPLETED,
          endDate: data.endDate,
        },
      });

      await tx.vehicle.update({
        where: { id: maintenance.vehicleId }, // use stored relation ID, not from body
        data: { status: VehicleStatus.AVAILABLE },
      });

      return updatedMaintenance;
    });
  }
}
