import { prisma } from '../config/prisma';
import { DriverStatus } from '../shared/enums/DriverStatus';
import { ApiError } from '../utils/api-error';

export class DriverService {
  /**
   * List drivers with optional filtering
   */
  public static async getDrivers(filters?: {
    status?: DriverStatus;
    category?: string;
    search?: string;
  }) {
    const whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.category) {
      whereClause.category = {
        contains: filters.category,
        mode: 'insensitive',
      };
    }

    if (filters?.search) {
      whereClause.OR = [
        {
          name: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
        {
          licenseNumber: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return prisma.driver.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get driver by ID
   */
  public static async getDriverById(id: number) {
    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new ApiError(404, 'Driver not found');
    }

    return driver;
  }

  /**
   * Create a new driver
   */
  public static async createDriver(data: {
    name: string;
    licenseNumber: string;
    category: string;
    expiryDate: Date;
    contact: string;
    safetyScore: number;
    status: DriverStatus;
  }) {
    if (data.status === DriverStatus.ON_TRIP) {
      throw new ApiError(400, 'Cannot set driver status to ON_TRIP. Status must be managed via Trip lifecycle.');
    }

    const existingDriver = await prisma.driver.findUnique({
      where: { licenseNumber: data.licenseNumber },
    });

    if (existingDriver) {
      throw new ApiError(409, 'Driver license number already exists');
    }

    return prisma.driver.create({
      data: {
        name: data.name,
        licenseNumber: data.licenseNumber,
        category: data.category,
        expiryDate: data.expiryDate,
        contact: data.contact,
        safetyScore: data.safetyScore,
        status: data.status,
      },
    });
  }

  /**
   * Update an existing driver
   */
  public static async updateDriver(
    id: number,
    data: {
      name?: string;
      licenseNumber?: string;
      category?: string;
      expiryDate?: Date;
      contact?: string;
      safetyScore?: number;
      status?: DriverStatus;
    }
  ) {
    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new ApiError(404, 'Driver not found');
    }

    // Protect operational lifecycle status
    if (data.status === DriverStatus.ON_TRIP) {
      throw new ApiError(400, 'Cannot set driver status to ON_TRIP. Status must be managed via Trip lifecycle.');
    }

    // Do not allow releasing an ON_TRIP driver if they have an active trip assignment
    if ((driver.status as string) === DriverStatus.ON_TRIP && data.status !== undefined) {
      const activeTrip = await prisma.trip.findFirst({
        where: {
          driverId: id,
          status: 'DISPATCHED', // Active trip status
        },
      });

      if (activeTrip) {
        throw new ApiError(400, 'Cannot change status of a driver with an active trip assignment');
      }
    }

    if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
      const existingDriver = await prisma.driver.findUnique({
        where: { licenseNumber: data.licenseNumber },
      });

      if (existingDriver) {
        throw new ApiError(409, 'Driver license number already exists');
      }
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.licenseNumber !== undefined) updateData.licenseNumber = data.licenseNumber;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
    if (data.contact !== undefined) updateData.contact = data.contact;
    if (data.safetyScore !== undefined) updateData.safetyScore = data.safetyScore;
    if (data.status !== undefined) updateData.status = data.status;

    return prisma.driver.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a driver
   */
  public static async deleteDriver(id: number) {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            trips: true,
          },
        },
      },
    });

    if (!driver) {
      throw new ApiError(404, 'Driver not found');
    }

    if (driver._count.trips > 0) {
      throw new ApiError(
        409,
        'Cannot delete driver because they have dependent operational records (trips)'
      );
    }

    return prisma.driver.delete({
      where: { id },
    });
  }

  /**
   * Check if a driver's license has expired
   */
  public static isLicenseExpired(expiryDate: Date): boolean {
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const expDate = new Date(expiryDate);
    const expDateClean = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate());
    return expDateClean.getTime() < todayDate.getTime();
  }

  /**
   * Check if a driver is operationally assignable for a trip
   */
  public static isAssignable(driver: { status: any; expiryDate: Date }): boolean {
    const status = driver.status as string;
    if (status === DriverStatus.SUSPENDED) {
      return false;
    }
    if (status !== DriverStatus.AVAILABLE) {
      return false;
    }
    if (this.isLicenseExpired(driver.expiryDate)) {
      return false;
    }
    return true;
  }
}
