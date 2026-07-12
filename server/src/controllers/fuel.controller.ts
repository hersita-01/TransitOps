import { Request, Response, NextFunction } from 'express';
import { FuelService } from '../services/fuel.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class FuelController {
  /**
   * List all fuel logs with optional filters
   */
  public static getFuelLogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const logs = await FuelService.getFuelLogs(filters as any);
    return res.status(200).json(
      new ApiResponse('Fuel logs retrieved successfully', logs)
    );
  });

  /**
   * Get a single fuel log by ID
   */
  public static getFuelLogById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const log = await FuelService.getFuelLogById(id);
    return res.status(200).json(
      new ApiResponse('Fuel log retrieved successfully', log)
    );
  });

  /**
   * Create a new fuel log
   */
  public static createFuelLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const log = await FuelService.createFuelLog(req.body);
    return res.status(201).json(
      new ApiResponse('Fuel log created successfully', log)
    );
  });

  /**
   * Update an existing fuel log
   */
  public static updateFuelLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const log = await FuelService.updateFuelLog(id, req.body);
    return res.status(200).json(
      new ApiResponse('Fuel log updated successfully', log)
    );
  });

  /**
   * Delete a fuel log
   */
  public static deleteFuelLog = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    await FuelService.deleteFuelLog(id);
    return res.status(200).json(
      new ApiResponse('Fuel log deleted successfully', null)
    );
  });
}
