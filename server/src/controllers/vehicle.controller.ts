import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class VehicleController {
  /**
   * List all vehicles with optional filters
   */
  public static getVehicles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // req.query is validated and parsed by the listVehiclesSchema
    const filters = req.query;
    const vehicles = await VehicleService.getVehicles(filters);
    
    return res.status(200).json(
      new ApiResponse('Vehicles retrieved successfully', vehicles)
    );
  });

  /**
   * Get a single vehicle by ID
   */
  public static getVehicleById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // req.params.id is coerced to a number by the validator
    const id = Number(req.params.id);
    const vehicle = await VehicleService.getVehicleById(id);
    
    return res.status(200).json(
      new ApiResponse('Vehicle retrieved successfully', vehicle)
    );
  });

  /**
   * Create a new vehicle
   */
  public static createVehicle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // req.body is validated and parsed by createVehicleSchema
    const vehicle = await VehicleService.createVehicle(req.body);
    
    return res.status(201).json(
      new ApiResponse('Vehicle created successfully', vehicle)
    );
  });

  /**
   * Update an existing vehicle
   */
  public static updateVehicle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // req.params.id is coerced to a number by the validator
    const id = Number(req.params.id);
    // req.body contains only validated fields from updateVehicleSchema
    const vehicle = await VehicleService.updateVehicle(id, req.body);
    
    return res.status(200).json(
      new ApiResponse('Vehicle updated successfully', vehicle)
    );
  });

  /**
   * Delete an existing vehicle
   */
  public static deleteVehicle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // req.params.id is coerced to a number by the validator
    const id = Number(req.params.id);
    await VehicleService.deleteVehicle(id);
    
    return res.status(200).json(
      new ApiResponse('Vehicle deleted successfully', null)
    );
  });
}
