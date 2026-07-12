import { Request, Response, NextFunction } from 'express';
import { DriverService } from '../services/driver.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class DriverController {
  /**
   * List all drivers with optional filters
   */
  public static getDrivers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const drivers = await DriverService.getDrivers(filters);
    
    return res.status(200).json(
      new ApiResponse('Drivers retrieved successfully', drivers)
    );
  });

  /**
   * Get a single driver by ID
   */
  public static getDriverById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const driver = await DriverService.getDriverById(id);
    
    return res.status(200).json(
      new ApiResponse('Driver retrieved successfully', driver)
    );
  });

  /**
   * Create a new driver
   */
  public static createDriver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const driver = await DriverService.createDriver(req.body);
    
    return res.status(201).json(
      new ApiResponse('Driver created successfully', driver)
    );
  });

  /**
   * Update an existing driver
   */
  public static updateDriver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const driver = await DriverService.updateDriver(id, req.body);
    
    return res.status(200).json(
      new ApiResponse('Driver updated successfully', driver)
    );
  });

  /**
   * Delete an existing driver
   */
  public static deleteDriver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    await DriverService.deleteDriver(id);
    
    return res.status(200).json(
      new ApiResponse('Driver deleted successfully', null)
    );
  });
}
