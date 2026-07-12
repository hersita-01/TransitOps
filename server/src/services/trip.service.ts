import { prisma } from '../config/prisma';
import { TripStatus } from '../shared/enums/TripStatus';
import { VehicleStatus } from '../shared/enums/VehicleStatus';
import { DriverStatus } from '../shared/enums/DriverStatus';
import { ApiError } from '../utils/api-error';
import { DriverService } from './driver.service';

export class TripService {
  /**
   * List trips with optional query filtering
   */
  public static async getTrips(filters?: {
    status?: TripStatus;
    vehicleId?: number;
    driverId?: number;
    search?: string;
  }) {
    const whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.vehicleId) {
      whereClause.vehicleId = filters.vehicleId;
    }

    if (filters?.driverId) {
      whereClause.driverId = filters.driverId;
    }

    if (filters?.search) {
      whereClause.OR = [
        {
          source: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          destination: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return prisma.trip.findMany({
      where: whereClause,
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a single trip by ID
   */
  public static async getTripById(id: number) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    return trip;
  }

  /**
   * Create a new trip (initially in DRAFT status)
   */
  public static async createTrip(data: {
    vehicleId: number;
    driverId: number;
    source: string;
    destination: string;
    cargoWeight: number;
    plannedDistance: number;
    startTime?: Date;
  }) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    const driver = await prisma.driver.findUnique({
      where: { id: data.driverId },
    });

    if (!driver) {
      throw new ApiError(404, 'Driver not found');
    }

    return prisma.trip.create({
      data: {
        vehicleId: data.vehicleId,
        driverId: data.driverId,
        source: data.source,
        destination: data.destination,
        cargoWeight: data.cargoWeight,
        plannedDistance: data.plannedDistance,
        status: TripStatus.DRAFT,
        startTime: data.startTime || new Date(),
      },
      include: {
        vehicle: true,
        driver: true,
      },
    });
  }

  /**
   * Update an existing trip (planning fields only)
   */
  public static async updateTrip(
    id: number,
    data: {
      vehicleId?: number;
      driverId?: number;
      source?: string;
      destination?: string;
      cargoWeight?: number;
      plannedDistance?: number;
      startTime?: Date;
    }
  ) {
    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    const currentStatus = trip.status as string;
    if (currentStatus === TripStatus.COMPLETED || currentStatus === TripStatus.CANCELLED) {
      throw new ApiError(400, 'Cannot update a completed or cancelled trip');
    }

    // Verify Vehicle exists if it's being updated
    if (data.vehicleId && data.vehicleId !== trip.vehicleId) {
      if (currentStatus !== TripStatus.DRAFT) {
        throw new ApiError(400, 'Cannot change vehicle on an active or dispatched trip');
      }
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
      });
      if (!vehicle) {
        throw new ApiError(404, 'Vehicle not found');
      }
    }

    // Verify Driver exists if it's being updated
    if (data.driverId && data.driverId !== trip.driverId) {
      if (currentStatus !== TripStatus.DRAFT) {
        throw new ApiError(400, 'Cannot change driver on an active or dispatched trip');
      }
      const driver = await prisma.driver.findUnique({
        where: { id: data.driverId },
      });
      if (!driver) {
        throw new ApiError(404, 'Driver not found');
      }
    }

    const updateData: any = {};
    if (data.vehicleId !== undefined) updateData.vehicleId = data.vehicleId;
    if (data.driverId !== undefined) updateData.driverId = data.driverId;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.destination !== undefined) updateData.destination = data.destination;
    if (data.cargoWeight !== undefined) updateData.cargoWeight = data.cargoWeight;
    if (data.plannedDistance !== undefined) updateData.plannedDistance = data.plannedDistance;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;

    return prisma.trip.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: true,
        driver: true,
      },
    });
  }

  /**
   * Dispatch a trip (Atomically sets Trip/Vehicle/Driver statuses to DISPATCHED/ON_TRIP)
   */
  public static async dispatchTrip(id: number) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    const tripStatus = trip.status as string;
    if (tripStatus !== TripStatus.DRAFT) {
      throw new ApiError(400, `Cannot dispatch a trip that is currently ${trip.status}`);
    }

    // 1. Vehicle availability check
    const vehicleStatus = trip.vehicle.status as string;
    if (vehicleStatus === VehicleStatus.IN_SHOP) {
      throw new ApiError(400, 'Vehicle is currently in shop');
    }
    if (vehicleStatus === VehicleStatus.RETIRED) {
      throw new ApiError(400, 'Vehicle is retired');
    }
    if (vehicleStatus === VehicleStatus.ON_TRIP) {
      throw new ApiError(409, 'Vehicle is already assigned to an active trip');
    }
    if (vehicleStatus !== VehicleStatus.AVAILABLE) {
      throw new ApiError(400, 'Vehicle is not available');
    }

    // 2. Driver availability check
    const driverStatus = trip.driver.status as string;
    if (driverStatus === DriverStatus.SUSPENDED) {
      throw new ApiError(400, 'Driver is suspended');
    }
    if (driverStatus === DriverStatus.ON_TRIP) {
      throw new ApiError(409, 'Driver is already assigned to an active trip');
    }
    if (driverStatus !== DriverStatus.AVAILABLE) {
      throw new ApiError(400, 'Driver is not available');
    }

    // 3. Driver license expiry check
    if (DriverService.isLicenseExpired(trip.driver.expiryDate)) {
      throw new ApiError(400, 'Driver license has expired');
    }

    // 4. Cargo capacity check
    if (Number(trip.cargoWeight) > trip.vehicle.capacity) {
      throw new ApiError(400, 'Cargo weight exceeds vehicle capacity');
    }

    // 5. Vehicle double assignment check (dispatched check)
    const activeVehicleTrip = await prisma.trip.findFirst({
      where: {
        vehicleId: trip.vehicleId,
        status: TripStatus.DISPATCHED,
        id: { not: id },
      },
    });
    if (activeVehicleTrip) {
      throw new ApiError(409, 'Vehicle is already assigned to an active trip');
    }

    // 6. Driver double assignment check (dispatched check)
    const activeDriverTrip = await prisma.trip.findFirst({
      where: {
        driverId: trip.driverId,
        status: TripStatus.DISPATCHED,
        id: { not: id },
      },
    });
    if (activeDriverTrip) {
      throw new ApiError(409, 'Driver is already assigned to an active trip');
    }

    // Execute atomic transaction
    return prisma.$transaction(async (tx) => {
      const updatedTrip = await tx.trip.update({
        where: { id },
        data: { status: TripStatus.DISPATCHED },
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.ON_TRIP },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.ON_TRIP },
      });

      return updatedTrip;
    });
  }

  /**
   * Complete a trip (Atomically sets Trip/Vehicle/Driver statuses to COMPLETED/AVAILABLE)
   */
  public static async completeTrip(
    id: number,
    data: {
      actualDistance?: number;
      fuelUsed?: number;
    }
  ) {
    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    const tripStatus = trip.status as string;
    if (tripStatus === TripStatus.COMPLETED) {
      throw new ApiError(400, 'Trip is already completed');
    }
    if (tripStatus === TripStatus.CANCELLED) {
      throw new ApiError(400, 'Cannot complete a cancelled trip');
    }
    if (tripStatus === TripStatus.DRAFT) {
      throw new ApiError(400, 'Cannot complete a draft trip');
    }
    if (tripStatus !== TripStatus.DISPATCHED) {
      throw new ApiError(400, 'Trip must be in dispatched status to be completed');
    }

    // Execute atomic transaction to complete trip and release resources
    return prisma.$transaction(async (tx) => {
      const updatedTrip = await tx.trip.update({
        where: { id },
        data: {
          status: TripStatus.COMPLETED,
          actualDistance: data.actualDistance,
          fuelUsed: data.fuelUsed,
          endTime: new Date(),
        },
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: DriverStatus.AVAILABLE },
      });

      return updatedTrip;
    });
  }

  /**
   * Cancel a trip (Atomically updates Trip status and releases resources if dispatched)
   */
  public static async cancelTrip(id: number) {
    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    const tripStatus = trip.status as string;
    if (tripStatus === TripStatus.CANCELLED) {
      throw new ApiError(400, 'Trip is already cancelled');
    }
    if (tripStatus === TripStatus.COMPLETED) {
      throw new ApiError(400, 'Cannot cancel a completed trip');
    }

    if (tripStatus === TripStatus.DRAFT) {
      // For draft trips, simply mark it cancelled. No vehicle or driver resources are occupied.
      return prisma.trip.update({
        where: { id },
        data: { status: TripStatus.CANCELLED },
      });
    }

    if (tripStatus === TripStatus.DISPATCHED) {
      // For dispatched trips, atomically cancel the trip and release resources.
      return prisma.$transaction(async (tx) => {
        const updatedTrip = await tx.trip.update({
          where: { id },
          data: { status: TripStatus.CANCELLED, endTime: new Date() },
        });

        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });

        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: DriverStatus.AVAILABLE },
        });

        return updatedTrip;
      });
    }

    throw new ApiError(400, `Unsupported lifecycle cancellation transition from status: ${trip.status}`);
  }
}
