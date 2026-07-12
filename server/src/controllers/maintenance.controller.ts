import { Request, Response, NextFunction } from 'express';
import { MaintenanceService } from '../services/maintenance.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class MaintenanceController {
  /**
   * List all maintenance records with optional filters
   */
  public static getMaintenanceRecords = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const records = await MaintenanceService.getMaintenanceRecords(filters as any);
    return res.status(200).json(
      new ApiResponse('Maintenance records retrieved successfully', records)
    );
  });

  /**
   * Get a single maintenance record by ID
   */
  public static getMaintenanceById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const record = await MaintenanceService.getMaintenanceById(id);
    return res.status(200).json(
      new ApiResponse('Maintenance record retrieved successfully', record)
    );
  });

  /**
   * Create a new maintenance record
   */
  public static createMaintenance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const record = await MaintenanceService.createMaintenance(req.body);
    return res.status(201).json(
      new ApiResponse('Maintenance record created successfully', record)
    );
  });

  /**
   * Update an existing maintenance record
   */
  public static updateMaintenance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const record = await MaintenanceService.updateMaintenance(id, req.body);
    return res.status(200).json(
      new ApiResponse('Maintenance record updated successfully', record)
    );
  });

  /**
   * Close a maintenance record
   */
  public static closeMaintenance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const record = await MaintenanceService.closeMaintenance(id, req.body);
    return res.status(200).json(
      new ApiResponse('Maintenance record closed successfully', record)
    );
  });
}
