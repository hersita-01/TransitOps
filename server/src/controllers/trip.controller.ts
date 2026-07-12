import { Request, Response, NextFunction } from 'express';
import { TripService } from '../services/trip.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class TripController {
  /**
   * List all trips with optional filters
   */
  public static getTrips = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const trips = await TripService.getTrips(filters as any);
    return res.status(200).json(
      new ApiResponse('Trips retrieved successfully', trips)
    );
  });

  /**
   * Get a single trip by ID
   */
  public static getTripById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const trip = await TripService.getTripById(id);
    return res.status(200).json(
      new ApiResponse('Trip retrieved successfully', trip)
    );
  });

  /**
   * Create a new trip
   */
  public static createTrip = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const trip = await TripService.createTrip(req.body);
    return res.status(201).json(
      new ApiResponse('Trip created successfully', trip)
    );
  });

  /**
   * Update an existing trip (safe planning fields only)
   */
  public static updateTrip = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const trip = await TripService.updateTrip(id, req.body);
    return res.status(200).json(
      new ApiResponse('Trip updated successfully', trip)
    );
  });

  /**
   * Dispatch a trip
   */
  public static dispatchTrip = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const trip = await TripService.dispatchTrip(id);
    return res.status(200).json(
      new ApiResponse('Trip dispatched successfully', trip)
    );
  });

  /**
   * Complete a trip
   */
  public static completeTrip = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const trip = await TripService.completeTrip(id, req.body);
    return res.status(200).json(
      new ApiResponse('Trip completed successfully', trip)
    );
  });

  /**
   * Cancel a trip
   */
  public static cancelTrip = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const trip = await TripService.cancelTrip(id);
    return res.status(200).json(
      new ApiResponse('Trip cancelled successfully', trip)
    );
  });
}
